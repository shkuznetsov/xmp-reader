'use strict';

const markerBegin = '<x:xmpmeta';
const markerEnd = '</x:xmpmeta>';

const bufferLimit = 65536;

const knownTags = [
	'MicrosoftPhoto:LastKeywordXMP',
	'MicrosoftPhoto:LastKeywordIPTC',
	'MicrosoftPhoto:Rating',
	'Iptc4xmpCore:Location',
	'xmp:Rating',
	'dc:title',
	'dc:description',
	'dc:creator',
	'dc:subject',
	'dc:rights',
	'cc:attributionName'
];

const envelopeTags = [
	'rdf:Bag',
	'rdf:Alt',
	'rdf:Seq',
	'rdf:li'
];

let fs = require('fs');

let bufferToPromise = (buffer) => new Promise((resolve, reject) => {
	if (!Buffer.isBuffer(buffer)) reject('Not a Buffer');
	else {
		let data = {raw: {}};
		let offsetBegin = buffer.indexOf(markerBegin);
		if (offsetBegin) {
			let offsetEnd = buffer.indexOf(markerEnd);
			if (offsetEnd) {
				let xmlBuffer = buffer.slice(offsetBegin, offsetEnd + markerEnd.length);
				let parser = require('sax').parser(true);
				let nodeName;

				parser.onerror = (err) => reject(err);
				parser.onend = () => resolve(data);

				parser.onopentag = function (node) {
					if (knownTags.indexOf(node.name) != -1) nodeName = node.name;
					else if (envelopeTags.indexOf(node.name) == -1) nodeName = null;
				};

				parser.ontext = function(text) {
					if (text.trim() != '') switch (nodeName) {
						case 'MicrosoftPhoto:LastKeywordXMP':
						case 'MicrosoftPhoto:LastKeywordIPTC':
							if (!data.raw[nodeName]) data.raw[nodeName] = [text];
							else if (data.raw[nodeName].indexOf(text) == -1) data.raw[nodeName].push(text);
							if (!data.keywords) data.keywords = [text];
							else if (data.keywords.indexOf(text) == -1) data.keywords.push(text);
							break;
						case 'dc:title':
							data.raw[nodeName] = text;
							data.title = text;
							break;
						case 'dc:description':
							data.raw[nodeName] = text;
							data.description = text;
							break;
						case 'xmp:Rating':
							data.raw[nodeName] = text;
							data.rating = parseInt(text);
							break;
						case 'MicrosoftPhoto:Rating':
							data.raw[nodeName] = text;
							data.rating = Math.floor(parseInt(text) + 12 / 25) + 1;
							break;
						case 'Iptc4xmpCore:Location':
							data.raw[nodeName] = text;
							data.location = text;
							break;
						case 'dc:creator':
							data.raw[nodeName] = text;
							data.creator = text;
							break;
						case 'dc:subject':
							data.raw[nodeName] = text;
							data.subject = text;
							break;
						case 'cc:attributionName':
							data.raw[nodeName] = text;
							data.attribution = text;
							break;
						case 'xmpRights:UsageTerms':
						case 'dc:rights':
							data.raw[nodeName] = text;
							data.terms = text;
							break;
					}
				};

				parser.write(xmlBuffer.toString('utf-8', 0, xmlBuffer.length)).close();
			}
			else resolve(data);
		}
		else resolve(data);
	}
});

let fileToBuffer = (file) => new Promise((resolve, reject) => {
	fs.open(file, 'r', (err, fd) => {
		if (err) reject(err);
		else {
			let buffer = new Buffer(bufferLimit);
			fs.read(fd, buffer, 0, bufferLimit, 0, (err, bytesRead, buffer) => {
				if (err) reject(err);
				else resolve(buffer);
			});
		}
	});
});

let promiseToCallback = (promise, callback) => {
	if ('function' == typeof callback) promise.then(
		(data) => callback(null, data),
		(error) => callback(error)
	);
	return promise;
};

module.exports.fromBuffer = (buffer, callback) => promiseToCallback(bufferToPromise(buffer), callback);
module.exports.fromFile = (filename, callback) => promiseToCallback(fileToBuffer(filename).then(bufferToPromise), callback);

'use strict';

var	expect = require('chai').expect,
	fs = require('fs'),
	xmpReader = require('../');

describe('xmp-reader', function () {

	let fixture = __dirname + '/fixture/test.jpg';
	let buffer = new Buffer(65536);

	let accertData = (data, done) => {
		try {
			expect(data.title).to.equal('Title');
			expect(data.description).to.equal('Title');
			expect(data.rating).to.equal(3);
			expect(data.keywords[0]).to.equal('tag1');
			expect(data.keywords[1]).to.equal('tag2');
			done();
		} catch (err) {
			done(err);
		};
	}

	before(function(done) {
		fs.open(fixture, 'r', (err, fd) => {
			if (err) done(err);
			else fs.read(fd, buffer, 0, 65536, 0, (err, bytesRead, buffer) => done(err))
		});
	});

	it('should accept a file and a callback', function(done)	{
		xmpReader.fromFile(fixture, (err, data) => {
			if (err) done(err);
			else accertData(data, done);
		});
	});

	it('should accept a buffer and a callback', function(done)	{
		xmpReader.fromBuffer(buffer, (err, data) => {
			if (err) done(err);
			else accertData(data, done);
		});
	});

	it('should accept a file and return a promise', function(done)	{
		xmpReader.fromFile(fixture).then(
			(data) => accertData(data, done),
			(err) => done(err)
		);
	});

	it('should accept a buffer and return a promise', function(done)	{
		xmpReader.fromBuffer(buffer).then(
			(data) => accertData(data, done),
			(err) => done(err)
		);
	});

	it('should fail if the file can not be read', function(done)	{
		xmpReader.fromFile(fixture + '__doesntexist').then(
			(data) => done('Data returned'),
			(err) => done()
		);
	});
});
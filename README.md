# xmp-reader  [![NPM version](https://badge.fury.io/js/xmp-reader.svg)](http://badge.fury.io/js/xmp-reader) [![Build Status](https://travis-ci.org/shkuznetsov/xmp-reader.svg?branch=master)](https://travis-ci.org/shkuznetsov/xmp-reader)
Extracts some commonly used XMP/RDF metadata tags from JPEG files.
Does not pretend to be a complete metadata management tool, but allows you to extract some information other EXIF-management tools on NPM fail to retrieve.
Was originally created only to extract a Description field baked into my JPEGs by Google's Picasa.

## Usage

To install the module add it to your project's ``package.json`` dependencies or install manually running:
```
npm install xmp-reader
```

Then pull it in your code:
```javascript
const xmpReader = require('xmp-reader');
```

Now you can either feed it a file name:
```javascript
xmpReader.fromFile('/path/to/file.jpg', (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});
```

Or a buffer:
```javascript
xmpReader.fromBuffer(buffer, (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});
```

Both methods above return a promise, you can use that instead of the ``callback``:
```javascript
xmpReader.fromBuffer(buffer).then(
  (data) => console.log(data),
  (err) => console.log(err)
);
```

Output will look something like that, depending on your metadata:
```javascript
{
	"raw": {
		"MicrosoftPhoto:Rating": "50",
		"dc:title": "Title",
		"dc:description": "Title",
		"dc:creator": "Alexander Kuznetsov",
		"Iptc4xmpCore:Location": "New York",
		"MicrosoftPhoto:LastKeywordXMP": ["tag1", "tag2"],
		"MicrosoftPhoto:LastKeywordIPTC": ["tag1", "tag2"],
		"xmp:Rating": "3"
	},
	"rating": 3,
	"title": "Title",
	"description": "Title",
	"creator": "Alexander Kuznetsov",
	"location": "New York",
	"keywords": ["tag1", "tag2"]
}
```
``raw`` property contains vendor-specific tag names.

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
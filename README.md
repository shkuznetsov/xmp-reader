# xmp-reader
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

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
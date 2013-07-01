var stream = require('stream');
var extend = require('extend');

var Transform = require('stream').Transform;

var toDocx = new Transform({decodeStrings: false});

extend(toDocx, {
	htmlBuffer: null
});

toDocx._transform = function _transform(chunk, encoding, done) {
  console.log('transform');
  if (!this.htmlBuffer) {
    this.htmlBuffer = new Buffer(chunk.length);
    chunk.copy(this.htmlBuffer);
  } else {
    this.htmlBuffer = Buffer.concat([this.htmlBuffer, chunk]);
  }
  done(null, null);
};

toDocx._flush = function _flush(done) {
  console.log('flush');
  this.push(this.htmlBuffer);
  done(null);
};

module.exports = {
	toDocx: toDocx
};

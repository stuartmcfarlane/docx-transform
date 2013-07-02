var stream = require('stream');
var extend = require('extend');
var Transform = require('stream').Transform;
var jsdom = require('jsdom');
var docx = require('./lib/docx.js');

var toDocx = function constroctToDocx(options) {
  var transform = new Transform({decodeStrings: false});
  transform.options = options;
  transform.htmlBuffer = null;

  transform._transform = function _transform(chunk, encoding, done) {
    console.log('transform');
    if (!this.htmlBuffer) {
      this.htmlBuffer = new Buffer(chunk.length);
      chunk.copy(this.htmlBuffer);
    } else {
      this.htmlBuffer = Buffer.concat([this.htmlBuffer, chunk]);
    }
    done(null, null);
  };

  transform._flush = function _flush(done) {
    console.log('flush');
    var htmlAsString = this.htmlBuffer.toString();
    var htmlAsDom = jsdom.jsdom({
      url: options.url,
      html: htmlAsString,
    });
    console.log('got dom');
    var htmlAsDocx = docx.convertContent(htmlAsDom);
    console.log('got docx', htmlAsDocx);
    this.push(htmlAsDocx);
    done(null);
  };
  return transform;
};

module.exports = {
	toDocx: toDocx
};

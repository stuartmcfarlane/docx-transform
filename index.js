var stream = require('stream');
var extend = require('extend');
var Transform = require('stream').Transform;
// var jsdom = require('jsdom');
// var docx = require('./lib/docx.js');

var toDocx = function constructToDocx(options) {
  console.log('constructToDocx', options);
  var transform = new Transform({decodeStrings: false});
  transform.options = options;
  transform.htmlBuffer = null;

  transform._transform = function _transform(chunk, encoding, done) {
    console.log('toDoc._transform');
    if (!this.htmlBuffer) {
      this.htmlBuffer = new Buffer(chunk.length);
      chunk.copy(this.htmlBuffer);
    } else {
      this.htmlBuffer = Buffer.concat([this.htmlBuffer, chunk]);
    }
    done(null, null);
  };

  transform.html2docx = function html2docx(html) {
    console.log('toDoc.html2docx');
    // var dom = jsdom.jsdom({
    //   url: options.url,
    //   html: html,
    // });
    // return docx.convertContent(dom);
    return html;
  };

  transform._flush = function _flush(done) {
    console.log('toDoc._flush');
    this.push(this.html2docx(this.htmlBuffer.toString()));
    done(null);
  };

  return transform;
};

module.exports = {
	toDocx: toDocx
};

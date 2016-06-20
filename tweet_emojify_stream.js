const {Transform} = require('stream');

class TweetEmojifyStream extends Transform {
  constructor(emojifier) {
    super({
      writableObjectMode: true,
      readableObjectMode: true,
    });
    this.emojifier = emojifier;
  }

  _transform(chunk, encoding, callback) {
    if (!Object.hasOwnProperty.call(chunk, 'text')) {
      return;
    }
    this.emojifier.emojify(chunk.text).then((emojified) => {
      chunk.emojified_text = emojified;

      callback(null, chunk);
    }).catch(console.error);
  }
}

module.exports = TweetEmojifyStream;

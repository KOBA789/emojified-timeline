const Twit = require('twit-stream');

class TwitterStream {
  constructor(keys) {
    const twitter = new Twit(keys);

    return twitter.sample({
      language: 'ja'
    });
  }
}

module.exports = TwitterStream;

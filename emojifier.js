const entries = require('object.entries');
const {IPAMorpheme} = require('./mecab');

const EMOJI_MAP = new Map(entries(require('./emoji.json')));

class Emojifier {
  constructor(mecab) {
    this.mecab = mecab;
  }

  emojifyMorpheme(morpheme) {
    if (morpheme.wc === '助詞'||
        morpheme.ctype === 'サ変・スル') {
      return morpheme.surface;
    }

    return (EMOJI_MAP.get(morpheme.surface) ||
            EMOJI_MAP.get(morpheme.yomi) ||
            EMOJI_MAP.get(morpheme.pronunciation) ||
            EMOJI_MAP.get(morpheme.original) ||
            morpheme.surface);
  }

  emojify(input) {
    return this.mecab.parse(input, IPAMorpheme).then((morphemes) => {
      const emojified = morphemes.map((morpheme) => {
        return this.emojifyMorpheme(morpheme);
      });

      return emojified.join('');
    });
  }
}

module.exports = Emojifier;

if (!module.parent) {
  const MeCab = require('./mecab');
  const mecab = new MeCab('-d /usr/lib/mecab/dic/mecab-ipadic-neologd');
  const emojifier = new Emojifier(mecab);
  emojifier.emojify('肉を炎で焼く。新幹線でダッシュ').then(console.log);
}

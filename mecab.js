const assert = require('assert');

const libmecab = require('./libmecab');

class Morpheme {
  constructor(node) {
    this.surface = node.surface;
    this.features = node.feature.split(',');
    this.stat = node.stat;
    this.cost = node.cost;
  }
}

class IPAMorpheme extends Morpheme {
  constructor(node) {
    super(node);

    this.wc = this.features[0];
    this.wc1 = this.features[1];
    this.wc2 = this.features[2];
    this.wc3 = this.features[3];
    this.ctype = this.features[4];
    this.cform = this.features[5];
    this.basic = this.features[6];
    this.yomi = this.features[7];
    this.pronunciation = this.features[8];
  }
}

class MeCab {
  constructor(args = '', morphemeClass = Morpheme) {
    this._model = libmecab.mecab_model_new2(args);
    this.morphemeClass = morphemeClass;
  }

  parse(input) {
    const tagger = libmecab.mecab_model_new_tagger(this.model);
    const lattice = libmecab.mecab_model_new_lattice(this.model);

    return new Promise((resolve, reject) => {
      libmecab.mecab_lattice_set_sentence.async(lattice, input, (err) => {
        if (err) {
          reject();
          return;
        }

        resolve();
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        libmecab.mecab_parse_lattice.async(tagger, lattice, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          if (result === 0) {
            reject(new Error('failed to parse input'));
            return;
          }

          resolve();
        });
      });
    }).then(() => {
      const result = [];
      let node_ptr = libmecab.mecab_lattice_get_bos_node(lattice);
      while (!node_ptr.isNull()) {
        const node = node_ptr.deref();

        result.push(new this.morphemeClass(node));

        node_ptr = node.next;
      }

      return result;
    });

    libmecab.mecab_destroy(tagger);
    libmecab.mecab_lattice_destroy(lattice);
  }

  dispose() {
    libmecab.mecab_model_destroy(this.model);
    this._model = null;
  }

  get model() {
    assert(this._model !== null, 'already diposed');

    return this._model;
  }
}

module.exports = Object.assign({}, MeCab, {
  Morpheme,
  IPAMorpheme
});

if (!module.parent) {
  const mecab = new MeCab('', IPAMorpheme);
  mecab.parse('すもももももももものうち').then((result) => {
    console.log(result);
  }).catch(console.error);
}

const ffi = require('ffi');
const ref = require('ref');
const RefStruct = require('ref-struct');
const {types} = ref;

const model_t = types.void;
const model_t_ptr = ref.refType(model_t);

const tagger_t = types.void;
const tagger_t_ptr = ref.refType(tagger_t);

const lattice_t = types.void;
const lattice_t_ptr = ref.refType(lattice_t);

const node_t = RefStruct();
const node_t_ptr = ref.refType(node_t);
[
  [ node_t_ptr, 'prev' ],
  [ node_t_ptr, 'next' ],
  [ 'pointer', 'enext' ],
  [ 'pointer', 'bnext' ],
  [ 'pointer', 'rpath' ],
  [ 'pointer', 'lpath' ],
  [ 'string', 'surface' ],
  [ 'string', 'feature' ],
  [ 'int', 'id' ],
  [ 'uint16', 'length' ],
  [ 'uint16', 'rlength' ],
  [ 'uint16', 'rcAttr' ],
  [ 'uint16', 'lcAttr' ],
  [ 'uint16', 'posid' ],
  [ 'uint8', 'char_type' ],
  [ 'uint8', 'stat' ],
  [ 'uint8', 'isbest' ],
  [ 'float', 'alpha' ],
  [ 'float', 'beta' ],
  [ 'float', 'prob' ],
  [ 'short', 'wcost' ],
  [ 'long', 'cost' ],
].forEach(([type, name]) => {
  node_t.defineProperty(name, type);
});

const libmecab = ffi.Library('libmecab', {
  mecab_model_new2: [model_t_ptr, ['string']],
  mecab_model_destroy: ['void', [model_t_ptr]],
  mecab_model_new_tagger: [tagger_t_ptr, [model_t_ptr]],
  mecab_destroy: ['void', [tagger_t_ptr]],
  mecab_model_new_lattice: [lattice_t_ptr, [model_t_ptr]],
  mecab_lattice_destroy: ['void', [lattice_t_ptr]],
  mecab_lattice_set_sentence: ['void', [lattice_t_ptr, 'string']],
  mecab_parse_lattice: ['int', [tagger_t_ptr, lattice_t_ptr]],
  mecab_lattice_get_bos_node: [node_t_ptr, [lattice_t_ptr]],
});

module.exports = Object.assign({}, libmecab, {
  node_t,
  node_t_ptr,
});

//console.log(node_t_ptr);

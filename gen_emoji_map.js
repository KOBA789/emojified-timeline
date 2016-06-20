const fs = require('fs');
const path = require('path');
const readline = require('readline');

const emojiRegex = require('emoji-regex')();

function isEmoji(str) {
  // FIXME: slower
  const match = str.match(emojiRegex);

  return match !== null && match[0] === str;
}

const symbols = {
  meaning: {},
  yomi: {},
  pronunciation: {},
};
const nouns = {
  meaning: {},
  yomi: {},
  pronunciation: {},
};

const rl = readline.createInterface({
  input: process.stdin,
  output: null,
});

rl.on('line', (line) => {
  const cols = line.split(',');
  if (isEmoji(cols[0])) {
    switch (cols[4]) {
    case '名詞':
      nouns.meaning[cols[10]] = cols[0];
      nouns.yomi[cols[11]] = cols[0];
      nouns.pronunciation[cols[12]] = cols[0];
      break;
    case '記号':
      symbols.meaning[cols[10]] = cols[0];
      symbols.yomi[cols[11]] = cols[0];
      symbols.pronunciation[cols[12]] = cols[0];
      break;
    }
  }
});

rl.on('close', () => {
  const merged = Object.assign(
    {},
    symbols.pronunciation,
    symbols.yomi,
    symbols.meaning,
    nouns.pronunciation,
    nouns.yomi,
    nouns.meaning
  );

  console.log('size: ', Object.keys(merged).length);

  const result = JSON.stringify(merged, null, 2);

  const outputPath = path.join(__dirname, 'emoji.json');
  fs.writeFile(outputPath, result);
});

rl.resume();

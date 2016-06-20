const path = require('path');
const http = require('http');
const WebSocketServer = require('ws').Server;
const {Server} = require('node-static');

const MeCab = require('./mecab');
const Emojifier = require('./emojifier');
const TwitterStream = require('./twitter_stream');
const TweetEmojifyStream = require('./tweet_emojify_stream');

const KEYS = require('./keys.json');

const PUBLIC_DIR = path.join(__dirname, './public');
const PORT = process.env.PORT || 8124;

const staticServer = new Server(PUBLIC_DIR, { cache: 0 });

const app = http.createServer((req, res) => {
  staticServer.serve(req, res);
});

const mecab = new MeCab(process.env.MECAB_OPTS);
const emojifier = new Emojifier(mecab);
const tw = new TwitterStream(KEYS);
const emojifyStream = new TweetEmojifyStream(emojifier);
const emojifiedTweetsStream = tw.pipe(emojifyStream);

const wss = new WebSocketServer({ server: app });
wss.on('connection', (ws) => {
  function onTweet(tweet) {
    ws.send(JSON.stringify(tweet));
  }
  emojifiedTweetsStream.on('data', onTweet);
  ws.on('close', () => {
    emojifiedTweetsStream.removeListener('data', onTweet);
  });
});

app.listen(PORT);

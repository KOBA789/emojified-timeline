# Emojified Timeline

Twitter の public stream (日本語) のツイートに含まれる語を適当に絵文字に置換します。

## デプロイ

`keys.json` に Twitter OAuth の token や secret を書き込んでください。

`gen_emoji_map.js` はキーワードと絵文字の転置インデックス `emoji.json` を生成します。NEologd の `mecab-user-dict-seed.20160616.csv` を標準入力に与えてください。

例:
```
$ xzcat /path/to/neologd/seed/mecab-user-dict-seed.20160616.csv.xz | node gen_emoji_map.js
```

環境変数 `MECAB_OPTS` にセットした値は mecab の初期化に使われます。辞書などを指定する場合に使います。

例: `MECAB_OPTS='-d /usr/lib/mecab/dic/mecab-ipadic-neologd'`

環境変数 `PORT` に整数値をセットすると、それを listen するポート番号として起動します。

`npm start` で起動します。

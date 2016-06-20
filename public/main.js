(function () {
  'use strict';

  function E (tagName, attrs, children) {
    const el = document.createElement(tagName);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      el.setAttribute(key, attrs[key]);
    });
    for (let child of children) {
      if (child instanceof Node) {
        el.appendChild(child);
      } else {
        el.appendChild(child.$elem);
      }
    }

    return el;
  }

  function T (text) {
    return document.createTextNode(text);
  }

  function buildTweetElem(tweet) {
    return E('div', {class: 'tweet'}, [
      E('img', {class: 'icon', src: tweet.user.profile_image_url}, []),
      E('div', {class: 'right-col'}, [
        E('div', {class: 'screen-name'}, [T('@' + tweet.user.screen_name)]),
        E('p', {class: 'body'}, [T(tweet.emojified_text)]),
        E('p', {class: 'raw-body'}, [T(tweet.text)]),
        E('a', {class: 'twitter-link', href: 'https://twitter.com/statuses/' + tweet.id_str}, [T('permalink')])
      ])
    ]);
  }

  const $timeline = document.getElementById('timeline');
  function addTweet(tweet) {
    $timeline.insertBefore(buildTweetElem(tweet), $timeline.firstChild);
  }

  const ws = new WebSocket('ws://' + location.host);
  ws.onmessage = function (message) {
    const tweet = JSON.parse(message.data);
    addTweet(tweet);
  };
})();

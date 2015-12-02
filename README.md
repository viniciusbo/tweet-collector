# TwitBot

Simple periodic tweet collector

```javascript
var TwitBot = require('twitbot');
var twitbot = TwitBot(twitterCredentials, {
  batchSize: 100,
  interval: 10, // seconds
});

twitbot.start();
twitbot.on('', function(tweetsArray) {
  console.log(tweetsArray);
});
```

## API

### `TwitBot(twitterCredentials, settings)`

Instantiate a TwitBot.

Example: 

```javascript
var twitbot = new TwitBot(twitterCredentials, settings);
```

### `twitbot.start()`

Start tweet collector.

### `twitbot.stop()`

Stop tweet collector.

### `twitbot.on('fetch', onTweetFetch)`

```javascript
twitbot.on('fetch', function onTweetFetch(tweetsArray) {
  console.log(tweetsArray);
});
```
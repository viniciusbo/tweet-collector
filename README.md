# Tweet Collector

Simple periodic tweet collector.

```bash
npm install --save twitcollector
```

```javascript
var TweetCollector = require('tweet-collector');
var tweetCollector = TweetCollector(twitterCredentials, {
  batchSize: 100,
  interval: 10, // seconds
});

tweetCollector.start();
tweetCollector.on('fetch', function(tweetsArray) {
  console.log(tweetsArray);
});
```

## API

### `TweetCollector(twitterCredentials, settings)`

Instantiate a TweetCollector.

Example: 

```javascript
var tweetCollector = new TweetCollector(twitterCredentials, settings);
```

### `tweetCollector.start()`

Start tweet collector.

### `tweetCollector.stop()`

Stop tweet collector.

### `tweetCollector.on('fetch', onTweetFetch)`

```javascript
tweetCollector.on('fetch', function onTweetFetch(tweetsArray) {
  console.log(tweetsArray);
});
```
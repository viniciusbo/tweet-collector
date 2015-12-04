# Tweet Collector

Simple periodic tweet collector.

```bash
npm install --save tweet-collector
```

```javascript
var TweetCollector = require('tweet-collector');
var tweetCollector = new TweetCollector(twitterCredentials, {
  batch_size: 100,
  interval: 10, // seconds
  search_params: {
    q: 'comma,separated,keywords'
  }
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
**search_params**

See [Twitter API Docs](https://dev.twitter.com/rest/reference/get/search/tweets).

### `tweetCollector.start(searchParams)`

Start tweet collector.


### `tweetCollector.stop()`

Stop tweet collector.

### `tweetCollector.on('fetch', onTweetFetch)`

```javascript
tweetCollector.on('fetch', function onTweetFetch(tweetsArray) {
  console.log(tweetsArray);
});
```
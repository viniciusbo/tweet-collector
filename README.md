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

Starts tweet collector instance.


### `tweetCollector.stop()`

Stops tweet collector instance.

### `tweetCollector.on('fetch', onTweetFetch)`

```javascript
tweetCollector.on('fetch', function onTweetFetch(tweetsArray) {
  console.log(tweetsArray);
});
```

## CLI

```bash
npm install -g tweet-collector
tweet-collector -h

  Usage: tweetcollector [options]

  Options:

    -h, --help                output usage information
    -t --twittercfg <path>    twitter credetinals configuration file
    -k --keywords "<string>"  comma separated keywords to search
    -b --batch-size <number>  twitter search batch size
    -i --interval <number>    twitter search interval window in seconds
tweet-collector -t path/to/cfg.json -k "comma,separated,keywords" -b 50 -i 60
```

See `config/twitter.json` for Twitter credentials configuration.

## Handling multiple collector instances

See [tweet-collector-supervisor](https://github.com/viniciusbo/tweet-collector-supervisor) package.
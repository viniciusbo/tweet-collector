var expect = require('chai').expect;
var TweetCollector = require('../lib/tweetCollector');
var twitterCredentials = require('../config/twitter');

describe('TweetCollector', function() {
  var tweetCollector;

  before(function(done) {
  	tweetCollector = new TweetCollector(twitterCredentials);
    done();
  });

  it('should periodically fetch tweets', function(done) {
    tweetCollector.start({
      q: 'test'
    });
    tweetCollector.on('fetch', function(tweets) {
      expect(tweets).to.be.array;
      tweetCollector.stop();
      done();
    });
	});
});
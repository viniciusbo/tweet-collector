var expect = require('chai').expect;
var TweetCollector = require('../lib/tweetCollector');
var twitterCredentials = require('../config/twitter');

describe('TweetCollector', function() {
  var tweetCollector;

  before(function(done) {
  	tweetCollector = new TweetCollector(twitterCredentials, {
      search_params: {
        q: 'test'
      }
    });
    done();
  });

  it('should start', function(done) {
    tweetCollector.start();
    done();
  });

  it('should fetch something', function(done) {
    tweetCollector.on('fetch', function(tweets) {
      expect(tweets).to.be.array;
      done();
    });
  })

  after(function(done) {
    tweetCollector.stop();
    done();
  })
});
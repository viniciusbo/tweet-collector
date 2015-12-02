var expect = require('chai').expect;
var TwitBot = require('../lib/twitbot');
var twitterCredentials = require('../config/twitter');

describe('TwitBot', function() {
  var twitbot;

  before(function(done) {
  	twitbot = new TwitBot(twitterCredentials);
    done();
  });

  it('should periodically fetch tweets', function(done) {
    twitbot.start({
      q: 'test'
    });
    twitbot.on('fetch', function(tweets) {
      expect(tweets).to.be.array;
      twitbot.stop();
      done();
    });
	});
});
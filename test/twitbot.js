var expect = require('chai').expect;
var TwitBot = require('twitbot').TwitBot;

describe('TwitBot', function() {
  var twitbot;

  before(function(done) {
  	twitbot = new TwitBot(twitterCredentials);
    done();
  });

  it('should periodically fetch tweets', function(done) {
    twitbot.start();
    twitbot.on('fetch', function(tweets) {
      expect(tweets).to.be.array;
      twitbot.stop();
      done();
    });
	});
});
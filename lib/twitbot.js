var Twit = require('twit');
var util = require('util');
var EventEmitter = require('events');

var TwitBot = function(twitterCredentials, settings) {
	EventEmitter.call(this);

	if (!settings)
		settings = {};

	this.twit = new Twit(twitterCredentials);
	this.search_params = {};
	this.search_params.count = settings.batchSize || 100; // Max 100
	this.interval_id = null;
	this.search_interval = settings.interval * 1000 || 10000;
	this.pending_request = false;
	this.last_tweet_id = null;

	console.log('   ______         _ __  ____        __ \n' +
				'  /_  __/      __(_) /_/ __ )____  / /_\n' +
				'   / / | | /| / / / __/ __  / __ \\/ __/\n' +
				'  / /  | |/ |/ / / /_/ /_/ / /_/ / /_  \n' +
				' /_/   |__/|__/_/\\__/_____/\\____/\\__/  \n' +
				'                                       \n');
};

util.inherits(TwitBot, EventEmitter);

TwitBot.prototype.fetchTweets = function() {
	var self = this;

	console.log(' TwitBot is searching for tweets...');

	if (self.pending_request) return;
	self.pending_request = true;

	if (self.last_tweet_id)
		self.search_params.since_id = self.last_tweet_id;

	self.twit.get('search/tweets', self.search_params, function(err, data) {
		if (err) console.error(err);

		console.log(' TwitBot found ' + data.statuses.length + ' tweets in ' + data.search_metadata.completed_in + ' seconds.');

		if (data.statuses)
			self.last_tweet_id = data.statuses[data.statuses.length - 1].id_str;

		self.emit('fetch', data.statuses);
		self.pending_request = false;
	});
};

TwitBot.prototype.start = function(searchParams) {
	if (searchParams && !searchParams.q) throw new Error('No query set.');

	this.search_params = searchParams;
	this.interval_id = setInterval(this.fetchTweets.bind(this), this.search_interval);
	this.fetchTweets();

	process.on('exit', this.stop);
};

TwitBot.prototype.stop = function() {
	clearInterval(this.interval_id);

	console.log(' TwitBot stopped.');
};

module.exports = TwitBot;

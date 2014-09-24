var repository = require('./repository'), //Repository factory function
	Twit = require('twit');

/**
 * Class constructor
 * @constructor
 * @param {object} twitterCredentials
 */
var TwitBot = function(twitterCredentials) {
	/**
	 * Initialize twit instance with given credentials
	 * @type {Twit}
	 */
	this.twit = new Twit(twitterCredentials);

	/**
	 * Repository instance
	 * @type {Object}
	 * @description The type of this variable is defined at runtime.
	 */
	this.repo = null;

	/**
	 * Store Twitter search parameters
	 * @type {Object}
	 * @description See https://dev.twitter.com/docs/api/1.1/get/search/tweets
	 */
	this.search_params = {};

	// Set default tweet count
	this.search_params.count = 100; // Max 100

	/**
	 * Store setInterval
	 */
	this.interval_id = null;

	/**
	 * Time to wait before searching
	 * @type {Number}
	 */
	this.search_interval = 10000;

	/**
	 * Stores tweet schema
	 * @type {Array}
	 */
	this.tweet_schema = [];

	/**
	 * Pending request flag
	 * @type {Boolean}
	 */
	this.pending_request = false;

	/**
	 * Filter hooks
	 * @type {Object}
	 */
	this.filters = {};

	// Fancy twitbot header
	console.log('   ______         _ __  ____        __ \n' +
				'  /_  __/      __(_) /_/ __ )____  / /_\n' +
				'   / / | | /| / / / __/ __  / __ \\/ __/\n' +
				'  / /  | |/ |/ / / /_/ /_/ / /_/ / /_  \n' +
				' /_/   |__/|__/_/\\__/_____/\\____/\\__/  \n' +
				'                                       \n');
};

/**
 * Set repository
 * @param {string} repoName
 * @param {Object} options
 */
TwitBot.prototype.setRepository = function(repoName, options) {
	// Cache this
	var self = this;

	// Call factory function
	repository(repoName, options, function(repository) {
		// Set repository
		self.repo = repository;

		console.log(' Repository open.');
	});
};

/**
 * Set request batch size
 * @param {Number} batchSize
 */
TwitBot.prototype.setBatchSize = function(batchSize) {
	this.search_params.count = batchSize;
};

/**
 * Set interval between requests
 * @param {Number} inverval In seconds
 */
TwitBot.prototype.setSearchInterval = function(inverval) {
	this.search_interval = interval * 1000;
};

/**
 * Add filter hook
 * @param {String}   filterName filter hook name
 * @param {Function} callback
 */
TwitBot.prototype.addFilter = function(filterName, callback) {
	if (typeof this.filters[filterName] == "undefined")
		this.filters[filterName] = [];

	// Add callback linked to a hook
	this.filters[filterName].push(callback);
};

/**
 * Aplly filters
 * @param  {String} filterName filter hook name
 * @param  {Object} data       data context
 * @return {Object}            filtered data
 */
TwitBot.prototype.applyFilters = function(filterName, data) {
	var filteredData = data;

	// Apply filters
	for (var filter in this.filters[filterName]) {
		 filteredData = this.filters[filterName][filter](filteredData);
	}

	return filteredData;
};

/**
 * Search for tweets
 * @return {array} tweets array
 */
TwitBot.prototype.searchTweets = function(callback) {
	// Cache this
	var self = this;

	// Ensure a repository is set
	if (!self.repo) {
		console.log(' No repository open yet.');

		return;
	}

	console.log(' TwitBot is searching for tweets...');

	if (self.pending_request) return;

	self.pending_request = true;

	// Get last tweet id
	self.repo.getLastTweetId(function(tweetId) {
		// If no last tweet id set, no need to set since_id
		if (tweetId > 0) {
			// Set since_id in search query
			self.search_params.since_id = tweetId;
		}

		// Search for tweets using twit
		self.twit.get('search/tweets', self.search_params, function(err, data) {
			if (err) console.error(err);

			console.log(' TwitBot found ' + data.statuses.length + ' tweets in '
				+ data.search_metadata.completed_in + ' seconds.');

			// Store tweets
			self.storeTweets(data.statuses, function(count) {
				console.log(' TwitBot persisted ' + count + ' tweets to repository.');
			});
			
			self.pending_request = false;
		});
	});
};

/**
 * Persist tweets to repository
 * @param  {object} data
 */
TwitBot.prototype.storeTweets = function(data, callback) {
	var filteredTweets = this.applyFilters('tweets.found', data);

	// Persist data to repository
	this.repo.persist(filteredTweets, callback);
};

/**
 * Start twitbot
 * @param {Object} queryParams Twitter API query params
 */
TwitBot.prototype.start = function(searchParams) {
	var self = this;

	// Set search params
	self.search_params = searchParams;

	// Ensure the required search field is set
	if (!self.search_params.q) throw new Error('No query set.');

	self.interval_id = setInterval(self.searchTweets.bind(self), this.search_interval);

	// Search for tweets now
	self.searchTweets();

	// Stop bot when process exits
	process.on('exit', self.stop);
};

/**
 * Stop twitbot
 */
TwitBot.prototype.stop = function() {
	console.log(' TwitBot stopped.');
};

// Export objects
module.exports = TwitBot;

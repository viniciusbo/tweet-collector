var TwitBot = require('./lib/twitbot'),
	config = {
		twitter: require('./config/twitter.js'),
		mongodb: require('./config/mongodb.js'),
	};

// Instantiate twitbot
var bot = new TwitBot(config.twitter);

// Get only the fields we want from each tweet
// See https://dev.twitter.com/docs/platform-objects/tweets
// Ommit this function to get all the fields
bot.addFilter('tweets.found', function(tweets) {
	var schema = ['id_str', 'text', 'coordinates', 'created_at', 'user.name', 'entities', 'lang'];

	var filteredTweets = tweets.map(function(tweet, index, tweetArray) {
		if (schema.length > 0) {
			// Store parsed tweet
			var parsedTweet = {};

			// Iterate through schema
			schema.forEach(function(field) {
				// Easiest way to get the desired field from tweet object,
				// since the fields in tweet_schema are defined using dot notation.
				parsedTweet[field] = eval('tweet.' + field);
			});

			return parsedTweet;
		}

		return tweet;
	});

	return filteredTweets;
});

bot.setRepository('mongodb', config.mongodb);

// Set twitter search parameters and start collecting tweets
// See https://dev.twitter.com/docs/api/1.1/get/search/tweets
bot.start({
	q: '#eleicoes2014'
});
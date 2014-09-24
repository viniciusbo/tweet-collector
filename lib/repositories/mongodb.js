var mongojs = require('mongojs');

/**
 * MongoDb repository
 * @constructor
 * @param {object} settings
 * @param {function} callback
 */
var MongoDb = function(settings, callback) {
	// MongoDb connection string
	var connStr = 'mongodb://' + settings.user + ':' + settings.pass + '@' + settings.host + ':' + settings.port + '/' + settings.db;

	// If no collection is given, use a collection based on current timestamp
	this.collection = (new Date()).getTime() || settings.collection;

	// Connect to database
	this.db = mongojs(connStr);

	// Cache collection
	this.collection = this.db.collection(settings.collection);

	// Ensure tweet id is indexed
	this.collection.ensureIndex({ id_str: -1 });

	// Callback function
	callback(this);
};

/**
 * Persist data to repository
 * @param {array} data
 * @param {function} callback function(persistedTweetCount)
 */
MongoDb.prototype.persist = function(data, callback) {
	// Ensure there is something to persist
	if (data.length > 0) {
		// console.log(data);
		// Insert documents to collection
		this.collection.insert(data, function(err, docs) {
			// Callback function
			if (docs && docs.length)
				callback(docs.length);
			else
				callback(0);
		});
	}
};

/**
 * Get last persisted tweet id
 * @param  {Function} callback
 */
MongoDb.prototype.getLastTweetId = function(callback) {
	// Find last tweet id
	this.collection.find({}, { limit: 1, fields: { id_str: 1 }, sort: { id_str: -1 } }, function(err, docs) {
		// Ensure a doc was found
		if (docs && !!docs.length)
			callback(docs[0].id_str);
		else 
			callback(false);
	});
};

module.exports = MongoDb;
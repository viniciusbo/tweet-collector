/**
 * Repository factory
 * @param {string} repo - repository name
 * @param {object} options - repository options
 * @param {function} callback
 * @return {object} instance of the repo class
 */
function repository(repo, options, callback) {
	try {
		// Load the desired repository
		var repoClass = require('./repositories/' + repo);
	} catch (err) {
		throw new Error('Can\'t open "' + repo + '" repository.');
	}

	// Instantiate repo using user options
	var repository = new repoClass(options, callback);

	// Return the repository object
	return repository;
}

module.exports = repository;
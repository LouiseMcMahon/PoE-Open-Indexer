'use strict';

module.exports.river = function (event, context, callback) {
	return callback(null, {nextId: 1234});
};
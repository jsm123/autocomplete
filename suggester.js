module.exports = function (config) {
    'use strict';

    var client = require('./clientFactory.js')(config);
    var suggester = require('./clientFeatures.js')(config);

    return {
        client: client,
        suggester: suggester
    };
};
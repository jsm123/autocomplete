'use strict';

var client;

module.exports = function (config) {

    if (! client) { // try with single tone
        var elasticsearch = require('elasticsearch');
        client = new elasticsearch.Client({
            host: config.host,
            //log: 'trace',
            apiVersion: '1.4'
        });
    }

    return client;
};
module.exports = function (config) {
    'use strict';

    var elasticsearch = require('elasticsearch');
    var client = new elasticsearch.Client({
        host: config.host,
        //log: 'trace',
        apiVersion: '1.4'
    });

    //module.exports = client; // try with single tone
    return client;
};


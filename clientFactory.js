var elasticsearch = require('elasticsearch');
var config = require('./indexConfig.js');

var client = new elasticsearch.Client({
    host: config.host,
    //log: 'trace',
    apiVersion: '1.4'
});

module.exports = client; // try with single tone
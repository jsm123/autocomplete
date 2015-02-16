module.exports = function (config) {
    'use strict';

    var _client = require('./clientFactory.js')(config);
    var sha1 = require('sha1');

    var createBulk = function (suggestions) {
        var s = [];

        suggestions.forEach(function (suggestion) {
            var id = sha1(suggestion);
            s.push({
                index: {
                    _index: config.index,
                    _type: config.type,
                    _id: id
                }
            });

            s.push({
                    suggest: {
                        input: suggestion,
                        weight: 1
                    }
                }
            );
        });

        return _client.bulk({body: s});
    };

    var createOrUpdate = function (suggestion) {
        var id = sha1(suggestion);
        return _client.get({
            index: config.index,
            type: config.type,
            id: id
        }).then(function (response) {
            var weight = 1;
            if (response.found) {
                weight += response._source.suggest.weight;
            }
            return _client.index({
                index: config.index,
                type: config.type,
                id: id,
                body: {
                    'suggest': {
                        'input': suggestion,
                        'weight': weight
                    }
                }
            });
        });
    };

    //elasticsearch.Client.prototype.concatAll = function () {
    //    var results = [];
    //    this.forEach(function (subArray) {
    //        results.push.apply(results, subArray);
    //    });
    //
    //    return results;
    //};



    return {
        createOrUpdate: createOrUpdate,
        createBulk: createBulk
    };
};
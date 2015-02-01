var elasticsearch = require('elasticsearch');
//var Promise = require('bluebird');

var _config = {
    host: 'localhost:9200',
    index: 'autocomplete',
    type: 'classified',
    mapping: {
        classified: {
            properties: {
                'name': {'type': 'string'},
                'suggest': {
                    'type': 'completion',
                    'index_analyzer': 'simple',
                    'search_analyzer': 'simple',
                    'payloads': true
                }
            }
        }
    },
    settings: {
        'analysis': {
            'analyzer': {
                'autocomplete_2': {
                    'tokenizer': 'keyword',
                    'filter': ['lowercase', 'edge_ngram_2']
                }
            },
            filter: {
                'edge_ngram_2': {
                    type: 'edgeNGram',
                    max_gram: 7
                }
            }
        }
    }
};

    var _client = new elasticsearch.Client({
        host: _config.host,
        //log: 'trace',
        apiVersion: '1.4'
    });

    _client.indices.delete({
        index: _config.index,
        ignore: [404]
    }).
    then(function () {
        console.log('index deleted');
        return _client.indices.create({
            index: _config.index,
            type: _config.type,
            body: {
                settings: _config.settings
            }
        });
    }).
    then(function () {
        console.log('index created');
        return _client.create({
            index: _config.index,
            type: _config.type,
            id: '1',
            body: {
                'name': 'Nevermind',
                'suggest': {
                    'input': 'audi a4 baujahr 2010 benziner',
                    'output': 'Nirvana - Nevermind - Blub',
                    'payload': {'artistId': 2321},
                    'weight': 34
                }
            }
        });
    }).
    then(function () {
        console.log('data added');
    }
);
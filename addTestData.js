var _client = require('./clientFactory.js');
var _config = require('./indexConfig.js');
var sha1 = require('sha1');

console.log('adding data');

var createBulk = function(suggestions) {
    var s = [];

    suggestions.forEach(function (suggestion) {
        var id = sha1(suggestion);
        s.push({
            index: {
                _index: _config.index,
                _type: _config.type,
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

    _client.bulk({body: s});
};

var updateExisting = function (suggestion) {
    var id = sha1(suggestion);
    _client.get({
        index: _config.index,
        type: _config.type,
        id: id
    }).then(function (response) {
        var weight = 1;
        if (response.found) {
            weight += response._source.suggest.weight;
        }
        _client.index({
            index: _config.index,
            type: _config.type,
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

var suggestions = [
    'audi a4 baujahr 2010 benziner',
    'audi a4 baujahr 2011 diesel',
    'audi a4 Baujahr 2012 eletro München',
    'bla blu'
];

createBulk(suggestions);
updateExisting('bla blu');


//_client.index({
//    index: _config.index,
//    type: _config.type,
//    id: '1',
//    body: {
//        'suggest': {
//            'input': 'audi a4 baujahr 2010 benziner',
//            //'output': 'audi a4 baujahr 2010 benziner',
//            //'payload': {'artistId': 2321},
//            'weight': 1
//        }
//    }
//    }).
//    then(function () {
//        console.log('done adding data');
//    });
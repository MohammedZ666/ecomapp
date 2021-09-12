const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
    {
        '$addFields': {
            'comments': []
        }
    }
];

MongoClient.connect(
    'mongodb+srv://netninja:hdMzljdYP6vX7Giq@nodetuts.z8yru.mongodb.net/nodetuts?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (connectErr, client) {
        assert.equal(null, connectErr);
        const coll = client.db('nodetuts').collection('products');
        coll.aggregate(agg, (cmdErr, result) => {
            assert.equal(null, cmdErr);
        });
        client.close();
    });
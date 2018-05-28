var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb+srv://hasan330:sawsan123456@madina-market-ocwnf.mongodb.net/test';

const assert = require('assert');


export default function mongoConnectionHelper(obj, collectionName) {
	console.log("\n\n\n\nWriting object ", obj , " to database")
    MongoClient.connect(uri, function(err, client) {
        if (!err) {
            console.log("Connection to mongodb successful !!")
            const collection = client.db("myDB").collection(collectionName);
            // perform actions on the collection object

            collection.insertOne(obj)
            client.close();
        } else {
            console.log("MongoDB Connection Failure: ", err)
        }
    });
}

// var api-key = '67582c4b-fd5e-4e0d-ad54-e7ffd72994d1'
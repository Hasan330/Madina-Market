var MongoClient = require('mongodb').MongoClient;
import { validatePassword } from '../helpers/pw-authenticator'
var uri = 'mongodb+srv://hasan330:sawsan123456@madina-market-ocwnf.mongodb.net/test';

const assert = require('assert');


export function mongoConnectionHelper(obj, collectionName) {
    console.log("\n\n\n\nWriting object ", obj, " to database")
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


export async function isAuthenticated(user, passwrod, collectionName, callback) {

    return MongoClient.connect(uri, function(err, client) {
        if (!err) {
            console.log("Connection to mongodb successful !!")
            const collection = client.db("myDB").collection(collectionName);

            collection.findOne({ name: user }, function(error, data) {
                if (data != null) {
                    console.log("Found user! ", user);
                    if (validatePassword(passwrod, data.password)) {
                        callback(true);
                    } else {
                        callback(false)

                    }
                } else {
                    callback(false)
                }

            })
        } else {
            console.log("MongoDB Connection Failure: ", err)
        }
    });
}

// var api-key = '67582c4b-fd5e-4e0d-ad54-e7ffd72994d1'
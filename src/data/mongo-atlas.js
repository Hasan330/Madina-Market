var MongoClient = require('mongodb').MongoClient;
import { validatePassword } from '../helpers/pw-authenticator'
var uri = 'mongodb+srv://hasan330:sawsan123456@madina-market-ocwnf.mongodb.net/test';

const assert = require('assert');


export function writeData(obj, collectionName) {
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

export function findSingleDayData(date, period, collectionName, callback) {
    console.log(`\n\n\n Trying to find data for: ${date} and period ${period} from database`)


    MongoClient.connect(uri, function(err, client) {
        if (!err) {
            console.log("Connection to mongodb successful !!")
            const collection = client.db("myDB").collection(collectionName);

            collection.findOne({ date: date, period: period }, function(error, data) {
                if (data != null) {
                    console.log("Found data ! ", data);
                    callback(data);
                } else {
                    console.log("No data found: ", error);
                    callback(error);
                }
                client.close();

            })

        } else {
            console.log("MongoDB Connection Failure: ", err)
        }
    });
}


export function updatePOSValue(id, collectionName, callback) {
    MongoClient.connect(uri, function(err, client) {
        if (!err) {
            console.log("Connection to mongodb successful !!")
            const collection = client.db("myDB").collection(collectionName);

            collection.findOne({ id }, function(error, data) {
                if (data != null) {
                    console.log("Found data ! ", data);
                    callback(data);
                } else {
                    console.log("No data found: ", error);
                    callback(error);
                }
                client.close();
            })

        } else {
            console.log("MongoDB Connection Failure: ", err)
        }
    });
}




export function isAuthenticated(user, passwrod, collectionName, callback) {

    return MongoClient.connect(uri, function(err, client) {
        if (!err) {
            console.log("Connection to mongodb successful !!")
            const collection = client.db("myDB").collection(collectionName);

            collection.findOne({ name: user }, function(error, data) {
                if (data != null) {
                    // console.log("Found user! ", user);
                    if (validatePassword(passwrod, data.password)) {
                        callback(true);
                        client.close();

                    } else {
                        callback(false)
                        client.close();


                    }
                } else {
                    callback(false)
                    client.close();

                }
            })
        } else {
            console.log("MongoDB Connection Failure: ", err)
        }
    });
}

// var api-key = '67582c4b-fd5e-4e0d-ad54-e7ffd72994d1'
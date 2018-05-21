var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb+srv://madina-market-ocwnf.mongodb.net/test';


export default function mongoConnectionHelper(){
	MongoClient.connect(uri, function(err, client) {
		console.log("Attempting to connect to uri: ", uri)
		if(!err){
			console.log("Connection to mongodb successful !!")
			const collection = client.db("test").collection("devices");
   			// perform actions on the collection object
   			client.close();
		}
		else {
			console.log("MongoDB Connection Failure: ", err)
		}
});
}
import express from 'express';
import bodyParser from 'body-parser';
import mongoConnectionHelper from './data/mongo-atlas'
import {fillStartingMoneyObj, calculateOhda} from './helpers';
import {ohdaValue, conversionRate, moneyToBeKeptObj} from './mock-data'


var server = express();

server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static( __dirname + '/../public'));
server.set('views', __dirname + '/../views');
 
server.get('/', (req, res) => {
	res.send("Hello there !")
})

server.get('/cash', (req, res) => {
	const keptMoneyObj = {}
	console.log("1) keptMoneyObj in beginning of get method is",  keptMoneyObj);

	res.render('index', {keptMoneyObj} )
})



server.post('/cash', (req, res) => {
	let keptMoneyObj = {};

	console.log("2) keptMoneyObj in beginning of post method is", keptMoneyObj);


	const startingMoneyObj = fillStartingMoneyObj(req.body);
	keptMoneyObj           = calculateOhda(startingMoneyObj, ohdaValue, conversionRate);
	console.log("3) keptMoneyObj in end of post method is", keptMoneyObj)


	mongoConnectionHelper(keptMoneyObj);
  	res.render('index', {keptMoneyObj})
})

server.listen(3000, () => {
	console.log('Started on port 3000')
})
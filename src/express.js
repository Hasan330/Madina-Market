import express from 'express';
import bodyParser from 'body-parser';
import mongoConnectionHelper from './data/mongo-atlas'
import {fillStartingMoneyObj, calculateOhda, fillConversionRates, getMoneyToBeSubmitted} from './helpers';
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
	const keptMoneyObj = {};
	const submittedMoneyObj = {};
	console.log("1) keptMoneyObj in beginning of get method is",  keptMoneyObj);

	res.render('index', {keptMoneyObj, submittedMoneyObj} )
})



server.post('/cash', (req, res) => {
	let keptMoneyObj = {};

	console.log("2) keptMoneyObj in beginning of post method is", keptMoneyObj);

	const conversionRate   = fillConversionRates(req.body);
	const startingMoneyObj = fillStartingMoneyObj(req.body);
	keptMoneyObj           = calculateOhda(startingMoneyObj, ohdaValue, conversionRate);
	console.log("3) keptMoneyObj in end of post method is", keptMoneyObj)

	const submittedMoneyObj = getMoneyToBeSubmitted(startingMoneyObj, keptMoneyObj)
	console.log("4) submittedMoneyObj in end of post method is", submittedMoneyObj)



	mongoConnectionHelper(keptMoneyObj);
  	res.render('index', {keptMoneyObj, submittedMoneyObj})
})

server.listen(3000, () => {
	console.log('Started on port 3000')
})
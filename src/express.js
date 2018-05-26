import express from 'express';
import bodyParser from 'body-parser';
import mongoConnectionHelper from './data/mongo-atlas'
import {fillStartingMoneyObj, calculateOhda, fillConversionRates, getMoneyToBeSubmitted, findSum} from './helpers';
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
	const keptMoneyObj      = {};
	const submittedMoneyObj = {};
	const startingMoneyObj = {};
	const startingTotal     = 0;
	const keptTotal         = 0;
	const submittedTotal    = 0;


	console.log("1) keptMoneyObj in beginning of get method is",  keptMoneyObj);

	res.render('index', {startingMoneyObj, keptMoneyObj, submittedMoneyObj, startingTotal, keptTotal, submittedTotal} )
})



server.post('/cash', (req, res) => {
	let keptMoneyObj      = {};
	let submittedMoneyObj = {}
	console.log("2) keptMoneyObj in beginning of post method is", keptMoneyObj);

	const conversionRate   = fillConversionRates(req.body);
	const startingMoneyObj = fillStartingMoneyObj(req.body);
	keptMoneyObj           = calculateOhda(startingMoneyObj, ohdaValue, conversionRate);
	console.log("3) keptMoneyObj in end of post method is", keptMoneyObj)

	submittedMoneyObj = getMoneyToBeSubmitted(startingMoneyObj, keptMoneyObj)
	console.log("4) submittedMoneyObj in end of post method is", submittedMoneyObj)

	const startingTotal  = findSum(startingMoneyObj, conversionRate)
	const keptTotal       = findSum(keptMoneyObj, conversionRate)
	const submittedTotal  = findSum(submittedMoneyObj, conversionRate)



	mongoConnectionHelper(keptMoneyObj);
  	res.render('index', {startingMoneyObj, keptMoneyObj, submittedMoneyObj, startingTotal, keptTotal, submittedTotal})
})

server.listen(3000, () => {
	console.log('Started on port 3000')
})
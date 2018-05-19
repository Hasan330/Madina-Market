import express from 'express';
import bodyParser from 'body-parser';
import {fillStartingMoneyObj, calculateOhda} from './helpers';
import {ohdaValue, conversionRate, moneyToBeKeptObj} from './mock-data'

let keptMoneyObj = {}

var server = express();

server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({extended: true}));
 
server.get('/', (req, res) => {
	res.send("Hello there !")
})

server.get('/cash', (req, res) => {
	res.render('index', {keptMoneyObj})
})

server.post('/cash', (req, res) => {
	console.log(req.body)
	const startingMoneyObj = fillStartingMoneyObj(req.body);
	keptMoneyObj           = calculateOhda(startingMoneyObj, moneyToBeKeptObj, ohdaValue, conversionRate);
	console.log('hello', keptMoneyObj);

  	res.render('index', {keptMoneyObj: keptMoneyObj})
})

server.listen(3000, () => {
	console.log('Started on port 3000')
})
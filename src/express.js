import express from 'express';
import bodyParser from 'body-parser';
import moment from 'moment';

import {writeData, findSingleDayData, isAuthenticated} from './data/mongo-atlas'
import {fillIns, fillOuts, fillStartingMoneyObj, calculateOhda, isEmpty, fillConversionRates, getMoneyToBeSubmitted, fillMetaData, findSum, convertMoneyObjToValuesArray} from './helpers';
import { validatePassword } from './helpers/pw-authenticator';
import {ohdaValue, conversionRate, moneyToBeKeptObj} from './mock-data'


var server = express();
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static( __dirname + '/../public'));
server.set('views', __dirname + '/../views');
 




server.get('/cash', (req, res) => {
	const keptMoneyObj      = {};
	const conversionRate    = {};
	const submittedMoneyObj = {};
	const startingMoneyObj  = {};
	const metaData          = {};
	const keptMoneyArr      = [];
	const startingMoneyArr  = [];
	const submittedMoneyArr = [];
	const startingTotal     =  0;
	const keptTotal         =  0;
	const submittedTotal    =  0;


	console.log("1) keptMoneyObj in beginning of get method is",  keptMoneyObj);

	res.render('calc-cash', {metaData, conversionRate, startingMoneyObj, startingMoneyArr, keptMoneyObj, submittedMoneyObj, startingTotal, keptTotal, submittedTotal, submittedMoneyArr, keptMoneyArr} )
})


server.get('/login', (req, res) => {
	res.render('login');
})




server.post('/login', (req, res) => {
	const {name, password} = req.body;

	isAuthenticated(name, password, 'users', function(authenticated){
		console.log("Authentication Status:", authenticated)
		if(authenticated){
			res.render('pos', {authenticated})	
		} else{
			res.redirect("/login")
		}

	})
})

server.post('/eval-single-day/', (req, res) => {
	const {date, period} = req.body; 

	//find data from database
	findSingleDayData(date, period, 'shiftData', function(shiftData){
		console.log("shiftData inside route, ", shiftData)

		shiftData ? res.render('match-pos-value', {shiftData}) : res.send("No data found for "+ date+ " and period: "+ period)

	})

})



server.get('/admin/check-pos', (req, res) => {
	let authenticated = false;

	res.render('pos', {authenticated});

})




server.post('/cash', (req, res) => {
	let startingMoneyObj  = {};
	let keptMoneyObj      = {};
	let submittedMoneyObj = {}
	console.log("2) keptMoneyObj in beginning of post method is", keptMoneyObj);
	console.log("2) Starting money object in beginning of post method is", startingMoneyObj);

	const metaData         = fillMetaData(req.body);
	const conversionRate   = fillConversionRates(req.body);
	
	startingMoneyObj       = fillStartingMoneyObj(req.body);
	const startingMoneyArr = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate);

	console.log("\n\n\n\n******\n metaData: \n", metaData);


	keptMoneyObj           = calculateOhda(startingMoneyObj, ohdaValue, conversionRate);
	const keptMoneyArr     = convertMoneyObjToValuesArray(keptMoneyObj, conversionRate);

	console.log("3) keptMoneyObj in end of post method is", keptMoneyObj)
	console.log("4) keptMoneyArr in end of post method is", keptMoneyArr)

	submittedMoneyObj = getMoneyToBeSubmitted(startingMoneyObj, keptMoneyObj)
	const submittedMoneyArr = convertMoneyObjToValuesArray(submittedMoneyObj, conversionRate)

	console.log("5) submittedMoneyObj in end of post method is", submittedMoneyObj)
	console.log("6) submittedMoneyArr in end of post method is", submittedMoneyArr)

	const startingTotal  = findSum(startingMoneyObj, conversionRate)
	const keptTotal       = findSum(keptMoneyObj, conversionRate)
	const submittedTotal  = findSum(submittedMoneyObj, conversionRate)


  	res.render('calc-cash', {metaData, conversionRate, startingMoneyObj, startingMoneyArr, keptMoneyObj, submittedMoneyObj, startingTotal, keptTotal, submittedTotal, submittedMoneyArr, keptMoneyArr})
})






server.post('/save', (req, res) => {

	if(isEmpty(req.body)) res.send('Please fill all form fields');
 	
	const shiftData         = {};
	let ins                 = {};
	let outs                = {};
 	let keptMoneyObj        = {};
	let submittedMoneyObj   = {};

	const metaData          = fillMetaData(req.body);
	const conversionRate    = fillConversionRates(req.body);
	const startingMoneyObj  = fillStartingMoneyObj(req.body);
	const startingMoneyArr  = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate);

	ins                     = fillIns(req.body);
	outs                    = fillOuts(req.body)
	keptMoneyObj            = calculateOhda(startingMoneyObj, ohdaValue, conversionRate);
	const keptMoneyArr      = convertMoneyObjToValuesArray(keptMoneyObj, conversionRate);

	submittedMoneyObj       = getMoneyToBeSubmitted(startingMoneyObj, keptMoneyObj)
	const submittedMoneyArr = convertMoneyObjToValuesArray(submittedMoneyObj, conversionRate)

	const startingTotal     = findSum(startingMoneyObj, conversionRate)
	const keptTotal         = findSum(keptMoneyObj, conversionRate)
	const submittedTotal    = findSum(submittedMoneyObj, conversionRate)

	startingMoneyObj.total  = startingTotal;
	keptMoneyObj.total      = keptTotal;
	submittedMoneyObj.total = submittedTotal;

	shiftData.startingMoney  = startingMoneyObj;
	shiftData.keptMoney      = keptMoneyObj;
	shiftData.submittedMoney = submittedMoneyObj;
	shiftData.ins            = ins;
	shiftData.outs           = outs;	
	shiftData.userName 	     = req.body.user_name;
    shiftData.cashUser 	     = req.body.cash_user;
    shiftData.date     	     = req.body.date;
    shiftData.period   	     = req.body.period;
	// shiftData.metaData       = metaData;

	
	writeData(shiftData, 'shiftData');

  	res.send('saved')
})

// server.get('*', (req, res) =>{
// 	//Return 404 page
// 	console.log("You hit an unrecognised route")
// 	res.send('You hit an unrecognised route')
// }) 

server.listen(3000, () => {
	console.log('Started on port 3000')
})
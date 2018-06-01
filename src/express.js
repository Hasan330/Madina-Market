import express from 'express';
import bodyParser from 'body-parser';
import {mongoConnectionHelper, isAuthenticated} from './data/mongo-atlas'
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

	console.log("Username is: ", name)
	console.log("Password is: ", password)

	isAuthenticated(name, password, 'users', function(authenticated){
		console.log("Authentication Status:", authenticated)
		if(authenticated){
			res.render('pos', {authenticated})	
		} else{
			res.redirect("/login")
		}

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



	// mongoConnectionHelper(keptMoneyObj);
  	res.render('calc-cash', {metaData, conversionRate, startingMoneyObj, startingMoneyArr, keptMoneyObj, submittedMoneyObj, startingTotal, keptTotal, submittedTotal, submittedMoneyArr, keptMoneyArr})
})






server.post('/save', (req, res) => {

	if(isEmpty(req.body)) res.send('Please fill all form fields');
 	

	let ins               = {};
	let outs              = {};
 	let keptMoneyObj      = {};
	let submittedMoneyObj = {};
	console.log("7) keptMoneyObj in beginning of post method is", keptMoneyObj);

	const metaData         = fillMetaData(req.body);
	const conversionRate   = fillConversionRates(req.body);
	const startingMoneyObj = fillStartingMoneyObj(req.body);
	const startingMoneyArr = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate);
	

	console.log("\n\n\n\n******\n metaData: \n", metaData);

	ins                    = fillIns(req.body);
	outs                   = fillOuts(req.body)
	keptMoneyObj           = calculateOhda(startingMoneyObj, ohdaValue, conversionRate);
	const keptMoneyArr     = convertMoneyObjToValuesArray(keptMoneyObj, conversionRate);

	console.log("8) keptMoneyObj in end of post method is", keptMoneyObj)
	console.log("9) keptMoneyArr in end of post method is", keptMoneyArr)

	submittedMoneyObj = getMoneyToBeSubmitted(startingMoneyObj, keptMoneyObj)
	const submittedMoneyArr = convertMoneyObjToValuesArray(submittedMoneyObj, conversionRate)

	console.log("10) submittedMoneyObj in end of post method is", submittedMoneyObj)
	console.log("11) submittedMoneyArr in end of post method is", submittedMoneyArr)

	const startingTotal   = findSum(startingMoneyObj, conversionRate)
	const keptTotal       = findSum(keptMoneyObj, conversionRate)
	const submittedTotal  = findSum(submittedMoneyObj, conversionRate)

	startingMoneyObj.total = startingTotal;
	startingMoneyObj.metaData = metaData;
	startingMoneyObj.ins = ins;
	startingMoneyObj.outs = outs;

	keptMoneyObj.total = keptTotal;
	keptMoneyObj.metaData = metaData;

	submittedMoneyObj.total = submittedTotal;
	submittedMoneyObj.metaData = metaData;
	submittedMoneyObj.ins = ins;
	submittedMoneyObj.outs = outs;

	console.log("Req body in save is: ", req.body)
	
	mongoConnectionHelper(startingMoneyObj, 'initialMoney');
	mongoConnectionHelper(keptMoneyObj, 'keptMoney');
	mongoConnectionHelper(submittedMoneyObj, 'submittedMoney');
  	res.send('saved')
})

server.get('*', (req, res) =>{
	//Return 404 page
	console.log("You hit an unrecognised route")
	res.send('You hit an unrecognised route')
}) 

server.listen(3000, () => {
	console.log('Started on port 3000')
})
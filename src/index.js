const _ = require('lodash')
import {ohdaValue, conversionRate, startingMoneyObj, moneyToBeKeptObj} from './mock-data'
import  {calculateOhda, convertMoneyObjToValuesArray, getMoneyToBeSubmitted, findSum} from './helpers';

const ohdaObj           = calculateOhda(startingMoneyObj, moneyToBeKeptObj, ohdaValue, conversionRate);
const ohdaArr           = convertMoneyObjToValuesArray(ohdaObj, conversionRate);

const submittedMoneyObj = getMoneyToBeSubmitted(startingMoneyObj, ohdaObj)
const submittedMoneyArr = convertMoneyObjToValuesArray(submittedMoneyObj, conversionRate)


console.log("Starting obj\n"             , startingMoneyObj)
console.log("Temp Ohda \n"               , ohdaObj)
console.log("submittedMoneyObj \n"       , submittedMoneyObj)
console.log("Sum of startingMoney= "     , findSum(startingMoneyObj, conversionRate))
console.log("Sum of ohdaMoney = "        , findSum(ohdaObj, conversionRate))
console.log("Sum of submittedMoneyObj= " , findSum(submittedMoneyObj, conversionRate))
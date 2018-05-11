const _ = require('lodash')
import {initialOhdaValue, ohdaValue, conversionRate, startingMoneyObj, moneyToBeSubmittedObj, moneyToBeKeptObj} from './mock-data'
import  {calculateOhda, convertMoneyObjToValuesArray, getMoneyToBeSubmitted, findSum} from './helpers';

const ohdaObj = calculateOhda(initialOhdaValue, startingMoneyObj, conversionRate, ohdaValue, moneyToBeSubmittedObj, moneyToBeKeptObj);
const ohdaArr = convertMoneyObjToValuesArray(ohdaObj, conversionRate);

const submittedMoneyObj = getMoneyToBeSubmitted(startingMoneyObj, ohdaObj)
const submittedMoneyArr = convertMoneyObjToValuesArray(submittedMoneyObj, conversionRate)


console.log("Starting obj", startingMoneyObj)

console.log("Temp Ohda ", ohdaObj)
console.log("Ohda Values", ohdaArr)

console.log("submittedMoneyObj ", submittedMoneyObj)
console.log("Ohda Values", submittedMoneyArr)

findSum(startingMoneyObj, conversionRate)
findSum(ohdaObj, conversionRate)
findSum(submittedMoneyObj, conversionRate)
const _ = require('lodash')
import {ohdaValue, conversionRate, startingMoneyObj, moneyToBeKeptObj} from './mock-data'
import  {calculateOhda, convertMoneyObjToValuesArray, getMoneyToBeSubmitted, findSum} from './helpers';

const startingMoneyArr  = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate)

const keptMoneyObj      = calculateOhda(startingMoneyObj, moneyToBeKeptObj, ohdaValue, conversionRate);
const keptMoneyArr      = convertMoneyObjToValuesArray(keptMoneyObj, conversionRate);

const submittedMoneyObj = getMoneyToBeSubmitted(startingMoneyObj, keptMoneyObj)
const submittedMoneyArr = convertMoneyObjToValuesArray(submittedMoneyObj, conversionRate)


console.log("\nStarting Money:\n"           , startingMoneyObj, "\n", startingMoneyArr)
console.log("\nMoney For Next Shift:  \n"   , keptMoneyObj, "\n", keptMoneyArr)
console.log("\nMoney To Be Submitted: \n"   , submittedMoneyObj, "\n", submittedMoneyArr)
console.log("Sum of startingMoney     = "   , findSum(startingMoneyObj, conversionRate))
console.log("Sum of ohdaMoney         = "   , findSum(keptMoneyObj, conversionRate))
console.log("Sum of submittedMoneyObj = "   , findSum(submittedMoneyObj, conversionRate))
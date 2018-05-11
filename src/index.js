const _ = require('lodash')
import {initialOhdaValue, ohdaValue, conversionRate, startingMoney, moneyToBeSubmitted, moneyToBeKept} from './mock-data'
import  {calculateOhda} from './helpers';

const tempOhdaArr = calculateOhda(initialOhdaValue, startingMoney, conversionRate, ohdaValue, moneyToBeSubmitted, moneyToBeKept);

console.log("Temp Ohda Array", tempOhdaArr)
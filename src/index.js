const _ = require('lodash')
import {initialOhdaValue, ohdaValue, conversionRate, startingMoney, moneyToBeSubmitted, moneyToBeKept} from './mock-data'
import  {calculateOhda, getDiff} from './helpers';

const keys           = _.keys(startingMoney);
const startingValues = _.values(startingMoney);

let convertedMoneyArray = _.zipWith(keys, startingValues , function(key, value) {
    return (key != 'JOD') ? key * value : conversionRate * value;
});

console.log("converted Money Array ", convertedMoneyArray)

const tempOhdaArr = calculateOhda(initialOhdaValue, startingMoney, convertedMoneyArray, ohdaValue, keys, moneyToBeSubmitted, moneyToBeKept);

console.log("Starting Money", startingMoney)
console.log("Temp Ohda Array", tempOhdaArr)
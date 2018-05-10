const _ = require('lodash')
import {ohdaValue, conversionRate, startingMoney} from '../mock-data/data.js'
import  {calculateOhda, getDiff} from './helpers';

const keys   = _.keys(startingMoney);
const values = _.values(startingMoney);

let totalValue = _.zipWith(keys, values , function(key, value) {
    return (key != 'JOD') ? key * value : conversionRate * value;
});

const tempOhdaArr = calculateOhda(totalValue, ohdaValue, keys);

console.log(getDiff(ohdaValue, tempOhdaArr[0], tempOhdaArr[1]))

// console.log("Starting Money\n", startingMoney);
console.log("Temp Ohda Array", tempOhdaArr)
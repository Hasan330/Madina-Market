const _ = require('lodash');

export function calculateOhda(startingMoneyObj, moneyToBeKeptValue, conversionRate) {
    const moneyToBeKeptObj = {
        USD: 0,
        USD2: 0,
        JOD: 0,
        JOD2: 0,
        200: 0,
        100: 0,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
        2: 0,
        1: 0,
        0: 0
    }

    console.log("Calculating ohda !!");

    let currentMoneyToBeKeptValue = 0;
    let convertedMoneyArray = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate)
    const keys = _.keys(startingMoneyObj);

    for (let i = 0; i < convertedMoneyArray.length; i++) {
        const currentMoneyLessThanIntended = (currentMoneyToBeKeptValue < moneyToBeKeptValue) ? true : false
        if (currentMoneyLessThanIntended) {

            let noteValue               = keys[i];
            moneyToBeKeptObj[noteValue] = getValueAtCertainPoint(noteValue, startingMoneyObj)
            currentMoneyToBeKeptValue  += convertedMoneyArray[i]

        } else {
            const noteValue = keys[i - 1];
            const diffAmount = getDiff(moneyToBeKeptValue, currentMoneyToBeKeptValue, noteValue);
            const index = getArrayIndexFromNoteValue(noteValue);

            moneyToBeKeptObj[noteValue] = startingMoneyObj[noteValue] - diffAmount;
            convertedMoneyArray[index] -= (noteValue * diffAmount);
            currentMoneyToBeKeptValue -= (noteValue * diffAmount);
            currentMoneyToBeKeptValue = removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, currentMoneyToBeKeptValue, moneyToBeKeptValue)

            break;
        }
    }
    return moneyToBeKeptObj;
}


function removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, currentMoneyToBeKeptValue, moneyToBeKeptValue) {
    let difference = currentMoneyToBeKeptValue - moneyToBeKeptValue;
    while (difference > 0) {
        difference = specifyNoteToSubtractFrom(startingMoneyObj, moneyToBeKeptObj, difference, currentMoneyToBeKeptValue)
        console.log(`Difference now is: ${difference}`)
    }
    return currentMoneyToBeKeptValue;
}

function specifyNoteToSubtractFrom(startingMoneyObj, moneyToBeKeptObj, difference, currentMoneyToBeKeptValue) {
    let numberOfNotesToTake;
    let returnedValue;
    const keys = _.reverse(_.keys(startingMoneyObj));
    const values = _.reverse(_.values(startingMoneyObj));
    const BreakException = {};

    try {
        keys.map((note, index) => {
            numberOfNotesToTake = (values[index] != 0 && note != 0 && note != 'JOD' && note != 'JOD2' && note != 'USD' && note != 'USD2') ? Math.floor(difference / note) : (note == 'JOD' || note == 'USD' || note == 'USD2' || note == 'JOD2' || values[index] == 0) ? 0.1 : Math.floor(difference / 0.5)

            if (Number(numberOfNotesToTake) >= 1) {
                //           Success: We could devide       2.5     by    2    at index    10    -->        0         to get          1
                console.log(`Success: We could devide ${difference} by ${note} at index ${index} -->  ${values[index]} to get ${numberOfNotesToTake}`)

                const notesToBeTaken = (values[index] >= numberOfNotesToTake) ? numberOfNotesToTake : values[index]; //Take all notes needed if you can, if not take available ones
                const amountDeducted = (note != 0) ? notesToBeTaken * note : notesToBeTaken * 0.5;

                moneyToBeKeptObj[note] -= notesToBeTaken;
                currentMoneyToBeKeptValue += amountDeducted;
                returnedValue = difference - amountDeducted

                throw BreakException;
            } else {
                console.log(`Error: we can't devide ${difference} by ${note} at index ${index} --> ${values[index]} to get ${numberOfNotesToTake}`)
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }
    return returnedValue;
}


function getDiff(ohdaValue, currentValue, noteValue) {
    return Math.floor((currentValue - ohdaValue) / noteValue);
}

function getValueAtCertainPoint(noteValue, moneyObj) {
    return moneyObj[noteValue];
}

export function convertMoneyObjToValuesArray(moneyObj, conversionRate) {
    const keys = _.keys(moneyObj);
    const values = _.values(moneyObj);

    return _.zipWith(keys, values, function(key, value) {
        return (key != 'JOD' && key != 'JOD2' && key != 'USD' && key != 'USD2') ? (key != 0) ? key * value : 0.5 * value : conversionRate[key] * value;
    });
}

export function getMoneyToBeSubmitted(startingMoneyObj, moneyToBeKeptObj) {
    const keys = _.keys(startingMoneyObj);
    const moneyToBeSubmittedObj = {}

    keys.forEach(key => {
        moneyToBeSubmittedObj[key] = startingMoneyObj[key] - moneyToBeKeptObj[key]
    })

    return moneyToBeSubmittedObj;
}

export function findSum(moneyObject, conversionRate) {
    var moneyArr = convertMoneyObjToValuesArray(moneyObject, conversionRate);
    const total = moneyArr.reduce((sum, value) => { return sum + value; }, 0)
    return total;
}

function getArrayIndexFromNoteValue(noteValue) {
    switch (Number(noteValue)) {
        case 200:
            return 7;
            break;
        case 100:
            return 6;
            break;
        case 50:
            return 5;
            break;
        case 20:
            return 4;
            break;
        case 10:
            return 3;
            break;
        case 5:
            return 2;
            break;
        case 2:
            return 1;
            break;
        case 1:
            return 0;
            break;
        case 0:
            return 8;
            break;
        default:
            console.log('returing index default')
            break;
    }
}

export function fillStartingMoneyObj(obj) {
    let startingMoneyObj = {};
    startingMoneyObj[0] = obj[0]
    startingMoneyObj[1] = obj[1]
    startingMoneyObj[2] = obj[2]
    startingMoneyObj[5] = obj[5]
    startingMoneyObj[10] = obj[10]
    startingMoneyObj[20] = obj[20]
    startingMoneyObj[50] = obj[50]
    startingMoneyObj[100] = obj[100]
    startingMoneyObj[200] = obj[200]
    startingMoneyObj.JOD = obj.JOD
    startingMoneyObj.JOD2 = obj.JOD2
    startingMoneyObj.USD = obj.USD
    startingMoneyObj.USD2 = obj.USD2

    console.log("Staring money object is:", startingMoneyObj);
    return startingMoneyObj;
}

export function fillConversionRates(obj){
    const conversionRate   = {};
    conversionRate['USD']  = obj['USD-conv']
    conversionRate['USD2'] = obj['USD2-conv']
    conversionRate['JOD']  = obj['JOD-conv']
    conversionRate['JOD2'] = obj['JOD2-conv']

    console.log("Conversion rate object is:", conversionRate);
    return conversionRate;
}

export function fillMetaData(obj){
    const metaData = {};

    metaData['userName'] = obj['user_name'];
    metaData['cashUser'] = obj['cash_user'];
    metaData['date']     = obj['date'];
    metaData['period']   = obj['period'];

    return metaData;
}

export function isEmpty(obj){
    return noMetaData(obj) ? true : false

    function noMetaData(obj){
        return (!obj.cash_user || !obj.user_name);
    }

    function noCash(obj){
        return (!obj[0] && !obj[1] && !obj[2] && !obj[5] && !obj[10] && !obj[20] && !obj[50] && !obj[100] && !obj[200] && !obj.JOD  && !obj.JOD2  && !obj.USD && !obj.USD2)
    }
}

export function fillIns(obj){
    const ins   = {}
    let   total = 0;
    for(let i=1; i<=10; i++){
        let text = `in-text-${i}`;
        let value = `in-value-${i}`;

        total     += Number(obj[value]);
        ins[text]  = obj[text];
        ins[value] = Number(obj[value]);
    }
    ins.total = total;
    console.log("Filled ins object with: ", ins);
    return ins;
}

export function fillOuts(obj){
    const outs   = {}
    let   total = 0;
    for(let i=1; i<=10; i++){
        let text = `out-text-${i}`;
        let value = `out-value-${i}`;

        total     += Number(obj[value]);
        outs[text]  = obj[text];
        outs[value] = Number(obj[value]);
    }
    outs.total = total;
    console.log("Filled outs object with: ", outs);
    return outs;
}
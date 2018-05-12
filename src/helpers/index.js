const _ = require('lodash');

export function calculateOhda(startingMoneyObj, moneyToBeKeptObj, moneyToBeKeptValue, conversionRate ) {

    let currentMoneyToBeKeptValue = 0;
    let convertedMoneyArray       = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate)
    const keys                    = _.keys(startingMoneyObj);
    
    for (let i = 0; i < convertedMoneyArray.length; i++) {
        const currentMoneyLessThanIntended   = (currentMoneyToBeKeptValue < moneyToBeKeptValue) ? true: false
        if (currentMoneyLessThanIntended) {
            
            let noteValue                    = keys[i];
            moneyToBeKeptObj[noteValue]      = getValueAtCertainPoint(noteValue, startingMoneyObj)
            currentMoneyToBeKeptValue       += convertedMoneyArray[i]
        
        }else {
            const noteValue                  = keys[i - 1];
            const diffAmount                 = getDiff(moneyToBeKeptValue, currentMoneyToBeKeptValue, noteValue);
            const index                      = getArrayIndexFromNoteValue(noteValue);

            moneyToBeKeptObj[noteValue]      = startingMoneyObj[noteValue] - diffAmount;
            convertedMoneyArray[index]      -= (noteValue * diffAmount);
            currentMoneyToBeKeptValue       -= (noteValue * diffAmount);
            currentMoneyToBeKeptValue        = removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, currentMoneyToBeKeptValue, moneyToBeKeptValue)
            
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
    const keys             = _.reverse(_.keys(startingMoneyObj));
    const values           = _.reverse(_.values(startingMoneyObj));
    const BreakException   = {};

    try {
        keys.map((note, index) => {
            numberOfNotesToTake = (note && values[index] && note != 0 && note != 'JOD' && note != 'USD') ? Math.floor(difference / note) : (note == 'JOD' || note == 'USD' || values[index] == 0) ? 0.1 : Math.floor(difference / 0.5)

            if (Number(numberOfNotesToTake) >= 1) {
                console.log(`Success: We could devide ${difference} by ${note} at index ${index} -->  ${values[index]} to get ${numberOfNotesToTake}`)

                const notesToBeTaken       = (values[index] >= numberOfNotesToTake) ? numberOfNotesToTake : values[index]; //Take all notes needed if you can, if not take available ones
                const amountDeducted       = (note != 0) ? notesToBeTaken * note : notesToBeTaken * 0.5;

                moneyToBeKeptObj[note]    -= notesToBeTaken;
                currentMoneyToBeKeptValue += amountDeducted;
                returnedValue              = difference - amountDeducted

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
    const keys   = _.keys(moneyObj);
    const values = _.values(moneyObj);

    return _.zipWith(keys, values, function(key, value) {
        return (key != 'JOD' && key != 'USD') ? (key != 0) ? key * value : 0.5 * value : conversionRate[key] * value;
    });
}

export function getMoneyToBeSubmitted(startingMoneyObj, moneyToBeKeptObj) {
    const keys                  = _.keys(startingMoneyObj);
    const moneyToBeSubmittedObj = {}
    
    keys.forEach(key => {
        moneyToBeSubmittedObj[key] = startingMoneyObj[key] - moneyToBeKeptObj[key]
    })

    return moneyToBeSubmittedObj;
}

export function findSum(moneyObject, conversionRate) {
    var moneyArr = convertMoneyObjToValuesArray(moneyObject, conversionRate);
    const total  = moneyArr.reduce((sum, value) => {return sum + value;}, 0)
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
        case 0.5:
            return 8;
            break;
        default:
            console.log('returing index default')
            break;
    }
}
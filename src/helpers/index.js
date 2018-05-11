const _ = require('lodash');

export function calculateOhda(currentMoneyToBeKeptValue, startingMoneyObj, conversionRate, moneyToBeKeptValue, moneyToBeSubmittedObj, moneyToBeKeptObj) {

    let convertedMoneyArray = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate)
    const keys = _.keys(startingMoneyObj);

    for (let i = 0; i < convertedMoneyArray.length; i++) {
        // currentMoneyToBeKeptValue is still less than the ohda 
        if (currentMoneyToBeKeptValue < moneyToBeKeptValue) {
            let noteValue               = keys[i];
            moneyToBeKeptObj[noteValue] = getValueAtCertainPoint(noteValue, startingMoneyObj)
            currentMoneyToBeKeptValue  += convertedMoneyArray[i]
        }

        // currentMoneyToBeKeptValue is now greater than ohda, remove from it
        else {
            const noteValue  = keys[i - 1];
            const diffAmount = getDiff(moneyToBeKeptValue, currentMoneyToBeKeptValue, noteValue);
            const index      = getArrayIndexFromNoteValue(noteValue);

            moneyToBeSubmittedObj[noteValue] = diffAmount;
            moneyToBeKeptObj[noteValue]      = startingMoneyObj[noteValue] - diffAmount;
            convertedMoneyArray[index]      -= (noteValue * diffAmount);
            currentMoneyToBeKeptValue       -= (noteValue * diffAmount);
            currentMoneyToBeKeptValue        = removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, moneyToBeSubmittedObj, currentMoneyToBeKeptValue, moneyToBeKeptValue)
            
            break;
        }
    }
    return moneyToBeKeptObj;
}


function removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, moneyToBeSubmittedObj, currentMoneyToBeKeptValue, moneyToBeKeptValue) {
    //Keep removing money notes until current ohda (currentMoneyToBeKeptValue) matches 1000
    let difference = currentMoneyToBeKeptValue - moneyToBeKeptValue;
    while (Number(difference) > 0) {
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
            numberOfNotesToTake = (note != 0 && note != 'JOD' && note != 'USD') ? Math.floor(difference / note) : (note == 'JOD' || note == 'USD') ? 0.1 : Math.floor(difference / 0.5)

            if (Number(numberOfNotesToTake) >= 1) {
                console.log(`Success: We could devide ${difference} by ${note} at index ${index} -->  ${values[index]} to get ${numberOfNotesToTake}`)

                //Take all notes needed if you can, if not take available ones
                const notesToBeTaken       = (values[index] >= numberOfNotesToTake) ? numberOfNotesToTake : values[index];
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
    const keys                = _.keys(startingMoneyObj);
    let moneyToBeSubmittedObj = {}
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
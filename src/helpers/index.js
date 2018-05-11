const _ = require('lodash');

export function calculateOhda(currentMoneyToBeKeptValue, startingMoney, conversionRate, moneyToBeKeptValue, moneyToBeSubmittedObj, moneyToBeKeptObj) {

    console.log("converted Money Array ", convertedMoneyArray)
    let convertedMoneyArray = convertMoneyObjToValuesArray(startingMoney, conversionRate)
    console.log("Starting Money", startingMoney)
    const keys              = _.keys(startingMoney);

    if(currentMoneyToBeKeptValue === moneyToBeKeptValue){
        console.log("Ohda complete!!")
        return moneyToBeSubmittedObj;
    }
    else {
        for (let i = 0; i < convertedMoneyArray.length; i++) {
            if (currentMoneyToBeKeptValue < moneyToBeKeptValue) {

                // TODO: Add number of notes to be sent to moneyToBeKeptObj 

                let noteValue = keys[i];
                console.log("Note value to be added to moneyToBeKeptObj is: ", noteValue)


                console.log("Adding to ohda value ", convertedMoneyArray[i])
                currentMoneyToBeKeptValue += convertedMoneyArray[i]
                // moneyToBeKeptObj
                console.log("Current ohda value inside if is: ", currentMoneyToBeKeptValue)

            } else {
                console.log("Current ohda value inside else 1 is: ", currentMoneyToBeKeptValue)
                
                let noteValue = keys[i - 1];
                console.log("Note value is: ", noteValue)
                let diffAmount = getDiff(moneyToBeKeptValue, currentMoneyToBeKeptValue, noteValue);
                
                moneyToBeSubmittedObj[noteValue] = diffAmount;
                moneyToBeKeptObj[noteValue]      = startingMoney[noteValue] - diffAmount;

                let index                  = getArrayIndexFromNoteValue(noteValue);
                convertedMoneyArray[index] = convertedMoneyArray[index] - (noteValue * diffAmount) 
                currentMoneyToBeKeptValue -= (noteValue * diffAmount);
                
                console.log("Current ohda value inside else 2 is: ", currentMoneyToBeKeptValue)
                console.log("Updated convertedMoneyArray ", convertedMoneyArray);
                console.log("Updated moneyToBeKeptObj ", moneyToBeKeptObj);
                console.log("Updated moneyToBeSubmittedObj ", moneyToBeSubmittedObj);

                // calculateOhda(currentMoneyToBeKeptValue, convertedMoneyArray, moneyToBeKeptValue, keys, moneyToBeSubmitted)
                break;
            }
        }
    }
}

export function getDiff(ohdaValue, currentValue, noteValue){
	return Math.floor((currentValue - ohdaValue) / noteValue);
}

function getValueAtCertainPoint(moneyObj, index, conversionRate){
    return 1;
}

function convertMoneyObjToValuesArray(moneyObj, conversionRate){
    console.log("Conversion rate in function is: ", conversionRate)
    const keys       = _.keys(moneyObj);
    const values     = _.values(moneyObj);

    return _.zipWith(keys, values , function(key, value) {
        return (key != 'JOD') ? (key != 0) ? key * value : 0.5 * value : conversionRate * value;
        });
}

function getArrayIndexFromNoteValue(noteValue) {
    switch (Number(noteValue)) {
        case 200:
            console.log('returing index 7')
            return 7;
            break;
        case 100:
            console.log('returing index 6')
            return 6;
            break;
         case 50:
            console.log('returing index 5')
            return 5;
            break;
        case 20:
            console.log('returing index 4')
            return 4;
            break;
        case 10:
            console.log('returing index 3')
            return 3;
            break;
        case 5:
            console.log('returing index 2')
            return 2;
            break;
        case 2:
            console.log('returing index 1')
            return 1;
            break;
        case 1:
            console.log('returing index 0')
            return 0;
            break;
         case 0.5:
            console.log('returing index 8')
            return 8;
            break;
        default:
            console.log('returing index default')
            break;
    }
}
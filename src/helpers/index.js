const _ = require('lodash');

export function calculateOhda(currentOhdaValue, startingMoney, conversionRate, ohdaValue, moneyToBeSubmitted, moneyToBeKept) {

    console.log("converted Money Array ", convertedMoneyArray)
    let convertedMoneyArray = convertMoneyObjToValuesArray(startingMoney, conversionRate)
    console.log("Starting Money", startingMoney)
    const keys              = _.keys(startingMoney);

    if(currentOhdaValue === ohdaValue){
        return moneyToBeSubmitted;
    }
    else {
        for (let i = 0; i < convertedMoneyArray.length; i++) {
            if (currentOhdaValue < ohdaValue) {
                console.log("Adding to ohda value ", convertedMoneyArray[i])
                currentOhdaValue += convertedMoneyArray[i]
                console.log("Current ohda value inside if is: ", currentOhdaValue)

            } else {
                console.log("Current ohda value inside else 1 is: ", currentOhdaValue)
                

                let noteValue = keys[i - 1];
                console.log("Note value is: ", noteValue)
                let diffAmount = getDiff(ohdaValue, currentOhdaValue, noteValue);
                
                moneyToBeSubmitted[noteValue] = diffAmount;
                moneyToBeKept[noteValue]      = startingMoney[noteValue] - diffAmount;

                let index                  = getArrayIndexFromNoteValue(noteValue);
                convertedMoneyArray[index] = convertedMoneyArray[index] - (noteValue * diffAmount) 
                currentOhdaValue -= (noteValue * diffAmount);
                
                console.log("Current ohda value inside else 2 is: ", currentOhdaValue)
                console.log("Updated convertedMoneyArray ", convertedMoneyArray);
                console.log("Updated moneyToBeKept ", moneyToBeKept);
                console.log("Updated moneyToBeSubmitted ", moneyToBeSubmitted);

                // calculateOhda(currentOhdaValue, convertedMoneyArray, ohdaValue, keys, moneyToBeSubmitted)
                break;
            }
        }
    }
}

export function getDiff(ohdaValue, currentValue, noteValue){
	return Math.floor((currentValue - ohdaValue) / noteValue);
}

function convertMoneyObjToValuesArray(moneyObj, conversionRate){
    console.log("Conversion rate in function is: ", conversionRate)
    const keys       = _.keys(moneyObj);
    const values     = _.values(moneyObj);

    return _.zipWith(keys, values , function(key, value) {
        return (key != 'JOD') ? key * value : conversionRate * value;
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

            // statements_def
            break;
    }
}
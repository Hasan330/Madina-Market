const _ = require('lodash');

export function calculateOhda(currentMoneyToBeKeptValue, startingMoneyObj, conversionRate, moneyToBeKeptValue, moneyToBeSubmittedObj, moneyToBeKeptObj) {

    let convertedMoneyArray = convertMoneyObjToValuesArray(startingMoneyObj, conversionRate)
    console.log("converted Money Array ", convertedMoneyArray)
    console.log("Starting Money\n", startingMoneyObj)
    const keys              = _.keys(startingMoneyObj);

    // Ohda Complete
    if(currentMoneyToBeKeptValue === moneyToBeKeptValue){
        console.log("Ohda complete!!")
        return moneyToBeSubmittedObj;
    }
    else {
        for (let i = 0; i < convertedMoneyArray.length; i++) {
            // currentMoneyToBeKeptValue is still less than the ohda 
            if (currentMoneyToBeKeptValue < moneyToBeKeptValue) {
                let noteValue = keys[i];
                moneyToBeKeptObj[noteValue] = getValueAtCertainPoint(noteValue, startingMoneyObj)
                currentMoneyToBeKeptValue += convertedMoneyArray[i]

                console.log("Adding to ohda value "             , convertedMoneyArray[i])
                console.log("Current ohda value inside if is: " , currentMoneyToBeKeptValue)
                // console.log("Updated moneyToBeKeptObj 1 "       , moneyToBeKeptObj);
            } 

            // currentMoneyToBeKeptValue is now greater than ohda, remove from it
            else {
                console.log("Current ohda value inside else 1 is: ", currentMoneyToBeKeptValue)
                
                let noteValue = keys[i - 1];
                // console.log("Note value is: ", noteValue)
                let diffAmount = getDiff(moneyToBeKeptValue, currentMoneyToBeKeptValue, noteValue);
                
                moneyToBeSubmittedObj[noteValue] = diffAmount;
                moneyToBeKeptObj[noteValue]      = startingMoneyObj[noteValue] - diffAmount;

                let index                  = getArrayIndexFromNoteValue(noteValue);
                convertedMoneyArray[index] = convertedMoneyArray[index] - (noteValue * diffAmount) 
                currentMoneyToBeKeptValue -= (noteValue * diffAmount);
                
                // console.log("Current ohda value inside else 2 is: ", currentMoneyToBeKeptValue)
                console.log("Updated convertedMoneyArray "         , convertedMoneyArray);
                console.log("Updated moneyToBeKeptObj \n"          , moneyToBeKeptObj);
                console.log("Updated moneyToBeSubmittedObj 2 \n"   , moneyToBeSubmittedObj);

                console.log(convertMoneyObjToValuesArray(moneyToBeKeptObj, conversionRate))

                currentMoneyToBeKeptValue = removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, moneyToBeSubmittedObj, currentMoneyToBeKeptValue, moneyToBeKeptValue)
                // calculateOhda(currentMoneyToBeKeptValue, startingMoneyObj, conversionRate, moneyToBeKeptValue, moneyToBeSubmittedObj, moneyToBeKeptObj)
                
                // TODO: Set the value of all moneyNotes greater than the index we are on to 0 in moneyToBeKept (momken ma ylzam !!)

                break;
            }
        }
    }
    return moneyToBeKeptObj;
}


function removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, moneyToBeSubmittedObj, currentMoneyToBeKeptValue, moneyToBeKeptValue){
    //Keep removing money notes until current ohda (currentMoneyToBeKeptValue) matches 1000
    let difference = currentMoneyToBeKeptValue - moneyToBeKeptValue;
    while(Number(difference) > 0){
        console.log("Difference is: ", difference);

        // 1) Specify which note is the note you should take from (difference / note  > 1 )
        difference = specifyNoteToSubtractFrom(startingMoneyObj, moneyToBeKeptObj, difference, currentMoneyToBeKeptValue)
        console.log(`Difference now is: ${difference}`)
    }
    return currentMoneyToBeKeptValue; 
}

function specifyNoteToSubtractFrom(startingMoneyObj, moneyToBeKeptObj, difference, currentMoneyToBeKeptValue){
    let keys   = _.reverse(_.keys(startingMoneyObj));
    let values = _.reverse(_.values(startingMoneyObj));
    let returnedValue;
    var BreakException = {};
    let numberOfNotesToTake;

    try {
        keys.map((note, index) => {  
            // console.log("\nNote is: ", note, "difference is", difference);
            numberOfNotesToTake = (note != 0 && note != 'JOD' && note != 'USD') ?  Math.floor(difference / note) : (note == 'JOD' || 'USD') ? 0.1 : Math.floor(difference / 0.5) 
            // console.log("******* Number of notes to take --> ", note, "--> ", numberOfNotesToTake)
            
            if(Number(numberOfNotesToTake) >= 1 ){
                console.log(`Success: We could devide ${difference} by ${note} at index ${index} -->  ${values[index]} to get ${numberOfNotesToTake}`)
                
                //Take all notes needed if you can, if not take available ones
                const notesToBeTaken = (values[index] >= numberOfNotesToTake) ? numberOfNotesToTake : values[index];
                console.log("NOtes to be taken --> ", notesToBeTaken)
                moneyToBeKeptObj[note] -=  notesToBeTaken;
                
                let amountDeducted =  (note != 0) ? notesToBeTaken * note: notesToBeTaken * 0.5;
                returnedValue = difference - amountDeducted
                currentMoneyToBeKeptValue += amountDeducted;

                console.log("Money to be kept objoect has been updated\n", moneyToBeKeptObj);
               throw BreakException;
            }
            else {
                console.log(`Error: we can't devide ${difference} by ${note} at index ${index} --> ${values[index]} to get ${numberOfNotesToTake}`)
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }
    
    return returnedValue;
}


function getDiff(ohdaValue, currentValue, noteValue){
	return Math.floor((currentValue - ohdaValue) / noteValue);
}

function getValueAtCertainPoint(noteValue, moneyObj){
    return moneyObj[noteValue];
}

export function convertMoneyObjToValuesArray(moneyObj, conversionRate){
    const keys       = _.keys(moneyObj);
    const values     = _.values(moneyObj);

    return _.zipWith(keys, values , function(key, value) {
        return (key != 'JOD' && key != 'USD') ? (key != 0) ? key * value : 0.5 * value : conversionRate[key] * value;
        });
}

export function getMoneyToBeSubmitted(startingMoneyObj, moneyToBeKeptObj){
    const keys              = _.keys(startingMoneyObj);
    let moneyToBeSubmittedObj = {}
    keys.forEach( key => {
        moneyToBeSubmittedObj[key] = startingMoneyObj[key] - moneyToBeKeptObj[key]
    })


    return moneyToBeSubmittedObj;
}

export function findSum(moneyObject, conversionRate){
    var moneyArr = convertMoneyObjToValuesArray(moneyObject, conversionRate);
    const total = moneyArr.reduce((sum, value) => {
        return sum + value;
    }, 0)
    return total;
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
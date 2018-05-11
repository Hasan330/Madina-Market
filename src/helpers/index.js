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
                console.log("Note value is: ", noteValue)
                let diffAmount = getDiff(moneyToBeKeptValue, currentMoneyToBeKeptValue, noteValue);
                
                moneyToBeSubmittedObj[noteValue] = diffAmount;
                moneyToBeKeptObj[noteValue]      = startingMoneyObj[noteValue] - diffAmount;

                let index                  = getArrayIndexFromNoteValue(noteValue);
                convertedMoneyArray[index] = convertedMoneyArray[index] - (noteValue * diffAmount) 
                currentMoneyToBeKeptValue -= (noteValue * diffAmount);
                
                console.log("Current ohda value inside else 2 is: ", currentMoneyToBeKeptValue)
                console.log("Updated convertedMoneyArray "         , convertedMoneyArray);
                console.log("Updated moneyToBeKeptObj \n"          , moneyToBeKeptObj);
                console.log("Updated moneyToBeSubmittedObj 2 \n"   , moneyToBeSubmittedObj);

                console.log(convertMoneyObjToValuesArray(moneyToBeKeptObj, conversionRate))

                removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, moneyToBeSubmittedObj, currentMoneyToBeKeptValue, moneyToBeKeptValue)
                // calculateOhda(currentMoneyToBeKeptValue, startingMoneyObj, conversionRate, moneyToBeKeptValue, moneyToBeSubmittedObj, moneyToBeKeptObj)
                
                // TODO: Set the value of all moneyNotes greater than the index we are on to 0 in moneyToBeKept (momken ma ylzam !!)

                break;
            }
        }
    }
}


function removeExcessMoney(startingMoneyObj, moneyToBeKeptObj, moneyToBeSubmittedObj, currentMoneyToBeKeptValue, moneyToBeKeptValue){
    //Keep removing money notes until current ohda (currentMoneyToBeKeptValue) matches 1000
    let difference = currentMoneyToBeKeptValue - moneyToBeKeptValue;
    while(Number(difference) > 0){
        console.log("Difference is: ", difference);

        // 1) Specify which note is the note you should take from (difference / note  > 1 )
        difference = specifyNoteToSubtractFrom(startingMoneyObj, moneyToBeKeptObj, difference)
        console.log(`Difference now is: ${difference}`)


        // 2) Set (value - floor(difference / note)) to moneyToBeKeptObj and make sure there is enough notes from that billAmount to accomodate 
        // 3) repeat


        break;
    }
}

function specifyNoteToSubtractFrom(startingMoneyObj, moneyToBeKeptObj, difference){
    let keys   = _.reverse(_.keys(startingMoneyObj));
    let values = _.reverse(_.values(startingMoneyObj));
    let returnedValue;
    var BreakException = {};

    try {
        keys.map((note, index) => {
            let numberOfNotesToTake = Math.floor(difference / note)
            if(numberOfNotesToTake >= 1  && values[index]){
                console.log(`Note we could devide ${difference} by ${note} at index ${index} -->  ${values[index]} to get ${numberOfNotesToTake}`)
                
                //Take all notes needed if you can, if not take available ones
                const notesToBeTaken = (values[index] >= numberOfNotesToTake) ? numberOfNotesToTake : values[index];
                moneyToBeKeptObj[note] -=  notesToBeTaken;
                
                let amountDeducted =  notesToBeTaken * note;
                returnedValue = difference - amountDeducted

                console.log("Money to be kept objoect has been updated\n", moneyToBeKeptObj);
                throw BreakException;
            }
            else {
                console.log(`Error: we can't devide ${difference} by ${note} at index ${index} --> ${values[index]} to get ${difference/ note}`)
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
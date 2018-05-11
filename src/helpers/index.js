export function calculateOhda(currentOhdaValue, startingMoney, convertedMoneyArray, ohdaValue, keys, moneyToBeSubmitted, moneyToBeKept) {

    if(currentOhdaValue === ohdaValue){
        return moneyToBeSubmitted;
    }
    else {
        for (let i = 0; i < convertedMoneyArray.length; i++) {
            if (currentOhdaValue < ohdaValue) {
                currentOhdaValue += convertedMoneyArray[i]
            } else {
                let noteValue = keys[i - 1];
                console.log("Note value is: ", noteValue)
                let diffAmount = getDiff(ohdaValue, currentOhdaValue, noteValue);
                
                moneyToBeSubmitted[noteValue] = diffAmount;
                moneyToBeKept[noteValue]      = startingMoney[noteValue] - diffAmount;

                let index                  = getArrayIndexFromNoteValue(noteValue);
                convertedMoneyArray[index] = convertedMoneyArray[index] - (noteValue * diffAmount) 

                console.log("Updated convertedMoneyArray ", convertedMoneyArray);
                console.log("Updated moneyToBeKept ", moneyToBeKept);

                // calculateOhda(currentOhdaValue, convertedMoneyArray, ohdaValue, keys, moneyToBeSubmitted)
                console.log(moneyToBeSubmitted);
                break;
            }
        }
    }
}

export function getDiff(ohdaValue, currentValue, noteValue){
	return Math.floor((currentValue - ohdaValue) / noteValue);
}

function getArrayIndexFromNoteValue(noteValue) {
    switch (noteValue) {
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
        
        default:
            // statements_def
            break;
    }
}
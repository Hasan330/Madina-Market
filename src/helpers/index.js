export function calculateOhda(currentOhdaValue, startingMoney, convertedMoneyArray, ohdaValue, keys, moneyToBeSubmitted, moneyToBeKept) {

    if(currentOhdaValue === ohdaValue){
        return moneyToBeSubmitted;
    }
    else {
        for (let i = 0; i < convertedMoneyArray.length; i++) {
            if (currentOhdaValue < ohdaValue) {
                currentOhdaValue += convertedMoneyArray[i]
            } else {
                let noteValue= keys[i - 1];
                console.log("Note value is: ", noteValue)
                let diffAmount = getDiff(ohdaValue, currentOhdaValue, noteValue);
                
                moneyToBeSubmitted[noteValue] = diffAmount;
                
                moneyToBeKept[noteValue] = startingMoney[noteValue] - diffAmount;
                convertedMoneyArray[5] = convertedMoneyArray[5] - (noteValue * diffAmount) 

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
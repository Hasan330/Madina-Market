export function calculateOhda(totalValue, ohdaValue, keys, moneyToBeSubmitted) {
    console.log('moneyToBeSubmitted ', moneyToBeSubmitted)
    let currentOhda = 0;
    for (let i = 0; i < totalValue.length; i++) {
        if (currentOhda < ohdaValue) {
            currentOhda += totalValue[i]
        } else {
            moneyToBeSubmitted[keys[i - 1]] = getDiff(ohdaValue, currentOhda, keys[i - 1])
            break;
        }
    }
    return [
        currentOhda,
        moneyToBeSubmitted
    ]
}

export function getDiff(ohdaValue, currentValue, noteValue){
	return Math.floor((currentValue - ohdaValue) / noteValue);
}
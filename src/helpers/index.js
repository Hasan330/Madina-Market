export function calculateOhda(totalValue, ohdaValue, keys) {
    let currentOhda = 0;
    for (let i = 0; i < totalValue.length; i++) {
        if (currentOhda < ohdaValue) {
            currentOhda += totalValue[i]
        } else {
            var currentNote = keys[i - 1]
            break;
        }
    }
    return [
        currentOhda,
        currentNote
    ]
}

export function getDiff(ohdaValue, currentValue, noteValue){
	return Math.floor((currentValue - ohdaValue) / noteValue);
}
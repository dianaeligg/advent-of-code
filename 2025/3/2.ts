import fs from 'fs';


/**
 * 
 * @param str full string
 * @param startPos first position to look at
 * @param placeInSequence which number out of the sequence this is starting with 1.  On '5678', '6' would have a placeInSequence of 2..
 * @param sequenceLength how long the sequence should be, '11' is 2, '1234' is 4
 * @returns 
 */
const getLargestPosition = (str: string, startPos: number, placeInSequence: number, sequenceLength: number) => {
    let largestDigitPosition = startPos;
    for (let i = largestDigitPosition; i < str.length; i++){
        if (str[i] === '9' && i < str.length - (sequenceLength - placeInSequence)){
            // console.log('NINE', {str, i, startPos, largestDigitPosition, start: str[startPos], largest: str[i]})
            return i;
        }
        if (parseInt(str[i]) > parseInt(str[largestDigitPosition]) && i < str.length - (sequenceLength - placeInSequence)){
            largestDigitPosition = i;
        }
    }
    // console.log({str, startPos, largestDigitPosition, start: str[startPos], largest: str[largestDigitPosition]})
    return largestDigitPosition;
}

export const getLargestJoltage = (str: string, sequenceLength: number) => {
    const positions = new Array(sequenceLength);

    let prevPosition = -1;
    for (let i = 0; i < sequenceLength; i++){
        const pos = getLargestPosition(str, prevPosition + 1, i + 1, sequenceLength);
        positions[i] = pos;
        prevPosition = pos;
    }

    const substr = positions.map(pos => str[pos]).join('');

    console.log({str, substr})
    return parseInt(substr);
}

const main = () => {
    const file = process.argv[2] || 'input.txt';

    const data = fs.readFileSync(`input/${file}`, {
    encoding: 'utf8',
    flag: 'r',
    });

    const dataArr = data.split('\n');

    console.log({ file, lineCount: dataArr.length });

    const sum = dataArr.reduce((acc, curr) => {
        return acc + getLargestJoltage(curr, 12);
    }, 0);

    console.log({sum});
}


main();
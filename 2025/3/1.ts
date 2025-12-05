import fs from 'fs';

export const getLargestJoltage = (str: string) => {

    let firstDigitPosition = 0;
    for (let i = 0; i < str.length; i++){
        if (str[i] === '9' && i < str.length - 1){
            firstDigitPosition = i;
            break;
        }
        if (parseInt(str[i]) > parseInt(str[firstDigitPosition]) && i < str.length - 1){
            firstDigitPosition = i;
        }
    }

    let secondDigitPosition = firstDigitPosition + 1;
    for (let i = firstDigitPosition + 1; i < str.length; i++){
        if (str[i] === '9'){
            secondDigitPosition = i;
            break;
        }
        if (parseInt(str[i]) > parseInt(str[secondDigitPosition])){
            secondDigitPosition = i;
        }
    }

    console.log({str, firstDigitPosition, secondDigitPosition, digitOne: str[firstDigitPosition], digitTwo: str[secondDigitPosition], parsed: parseInt(str[firstDigitPosition] + str[secondDigitPosition])})
    return parseInt(str[firstDigitPosition] + str[secondDigitPosition]);
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
        return acc + getLargestJoltage(curr);
    }, 0);

    console.log({sum});
}


main();
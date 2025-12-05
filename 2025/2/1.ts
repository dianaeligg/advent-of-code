import fs from 'fs';


//IDEA: identify subranges, grab firstPart and try to match with second part

const isInvalid = (num: number) => {
    const str = num.toString();
    if (str.length % 2 !== 0) {
        return false;
    }
    const firstPart = str.slice(0, str.length/2);
    const secondPart = str.slice(str.length/2, str.length);
    console.log({str, firstPart, secondPart});
    return firstPart === secondPart;
}


// range in XXXX-YYYY format
const getInvalidIdCount = (range: string) => {
    const [first, second] = range.split('-').map(n => parseInt(n));

    let invalidCount = 0;
    console.log({first,second})
    for (let i = first; i < second + 1; i++){
        if (isInvalid(i))
        {
            console.log(`${i} is Invalid`)
            invalidCount += i;
        }
    }
    return invalidCount;
}


const main = () => {
    const file = process.argv[2] || 'input.txt';

    const data = fs.readFileSync(`input/${file}`, {
    encoding: 'utf8',
    flag: 'r',
    });

    const dataArr = data.replaceAll('\n', '').split(',');

    console.log({ file, lineCount: dataArr.length });

    const sum = dataArr.reduce((acc, range) => acc + getInvalidIdCount(range), 0);
    console.log({sum})
}


main();
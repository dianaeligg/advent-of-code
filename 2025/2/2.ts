import fs from 'fs';


//IDEA: identify subranges, grab firstPart and try to match with second part

const primeNumbers = [1,2,3,5,7,9,11];


export const areAllItemsTheSame = (nums: Array<string>) => {
    const num = nums[0];
    return nums.every(curr => curr === num);
}

export const breakIntoSameSizeStrings = (str:string, num: number) => {
    if (num !== 1 && (str.length % num !== 0 || str.length === num)){
        return undefined;
    }
    const result:Array<string> = [];
    for(let i = 0; i < str.length; i+=num){
        result.push(str.slice(i, i+num));
    }
    return result;
}


const isInvalid = (num: number) => {
    const str = num.toString();
    console.log({str})
    
    for (let i = 1; i <= str.length/2; i++) {
        const brokenArray = breakIntoSameSizeStrings(str,i);
        if (brokenArray && areAllItemsTheSame(brokenArray)){
            return true;
        }
    }

    return false;
}


// range in XXXX-YYYY format
const getInvalidIdCount = (range: string) => {
    const [first, second] = range.split('-').map(n => parseInt(n));

    let invalidCount = 0;
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
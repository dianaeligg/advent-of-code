import fs from 'fs';

const file = process.argv[2] || 'input.txt';

const data = fs.readFileSync(`input/${file}`, {
  encoding: 'utf8',
  flag: 'r',
});

const dataArr = data.split('\n');

console.log({ file, lineCount: dataArr.length });
console.log('First 5 lines:', dataArr.slice(0, 5));

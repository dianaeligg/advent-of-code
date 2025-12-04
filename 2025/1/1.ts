import fs from 'fs';

const file = process.argv[2] || 'input.txt';

const data = fs.readFileSync(`input/${file}`, {
  encoding: 'utf8',
  flag: 'r',
});

const dataArr = data.split('\n');

console.log({ file, lineCount: dataArr.length });


const {count} = dataArr.reduce<{ currentPosition: number; count: number }>(({currentPosition, count}, line) => {
  const direction = line.slice(0, 1);
  const steps = parseInt(line.slice(1));
  
  if (direction === 'R') {
    currentPosition = (currentPosition + steps) % 100;
  } else if (direction === 'L') {
    currentPosition = (currentPosition - steps + 100) % 100;
  } 
  if (currentPosition === 0) {
    count++;
  }
  console.log({ currentPosition, count });
  return { currentPosition, count };
}, { currentPosition: 50, count: 0 });

console.log({ count });
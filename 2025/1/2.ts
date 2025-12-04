import fs from 'fs';

const file = process.argv[2] || 'input.txt';

const data = fs.readFileSync(`input/${file}`, {
  encoding: 'utf8',
  flag: 'r',
});

const dataArr = data.split('\n').slice(101,200);

console.log({ file, lineCount: dataArr.length });


const {count} = dataArr.reduce<{ currentPosition: number; count: number }>(({currentPosition, count}, line) => {
  const direction = line.slice(0, 1);
  const steps = parseInt(line.slice(1));

  const times = Math.floor(steps / 100);
  const remainder = steps % 100;

  const startPosition = currentPosition;
  
  const realTimes = times === 0 ? 1 : times;
  if (direction === 'R') {
    
    if (startPosition + steps > 100 && startPosition !== 0) {
        count += realTimes;
    }
    currentPosition = (startPosition + remainder) % 100;
   
  } else if (direction === 'L') {
    
    if (startPosition - steps < 0 && startPosition !== 0) {
        count += realTimes;
    }
    currentPosition = Math.abs((startPosition - remainder) % 100);
  } 

  if (currentPosition % 100 === 0) {
    count++;
  }

  if (currentPosition < 0) {
    console.log({ line, startPosition, currentPosition, realTimes, remainder, steps, count });
    throw new Error('Current position is less than 0');
  }
  console.log({ line, startPosition, currentPosition, realTimes, remainder, steps, count });
  return { currentPosition, count };
}, { currentPosition: 50, count: 0 });

console.log({ count });
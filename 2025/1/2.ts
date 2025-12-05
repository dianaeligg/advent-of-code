import fs from 'fs';

export const countZeroCrossings = ({startPosition, count, line}) => {
    const direction = line.slice(0, 1);
    const steps = parseInt(line.slice(1));
  
    const remainder = steps % 100;
    
    let newPosition = 0;
    let times = 0;
    
    
    if (direction === 'R') {
        newPosition = (startPosition + remainder) % 100;
        if (startPosition + steps > 100){
            const loops = Math.floor((startPosition + steps) / 100);
            times += loops;
            if(newPosition === 0){
                times--;
            }
        }

    } else if (direction === 'L') {
        newPosition = Math.abs(startPosition - remainder);
        if(startPosition - steps < 0){
            const loops = Math.floor(((100 - startPosition) + steps) / 100);
            times += loops;
            if (startPosition === 0){
                times--;
            }
        }
        if (startPosition - remainder < 0){
            newPosition = 100 - Math.abs(startPosition - remainder);
        }
    } 
    


    if (newPosition % 100 === 0){
        times++;
    }
  
    if (newPosition < 0) {
      throw new Error('Current position is less than 0');
    }
    console.log({ line, startPosition, remainder, times });
    return { newPosition, times };
}



const main = () => {
    const file = process.argv[2] || 'input.txt';

    const data = fs.readFileSync(`input/${file}`, {
    encoding: 'utf8',
    flag: 'r',
    });

    const dataArr = data.split('\n');

    console.log({ file, lineCount: dataArr.length });

    const {count} = dataArr.reduce<{ currentPosition: number; count: number }>(({currentPosition, count}, line) => {
        const {newPosition, times } = countZeroCrossings({startPosition: currentPosition, count, line})
        console.log({newPosition, count: count+times})
        return {currentPosition: newPosition, count: count + times}
    }, { currentPosition: 50, count: 0 });
    
    console.log({ count });
}


main();
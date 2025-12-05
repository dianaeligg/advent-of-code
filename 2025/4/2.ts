import fs from 'fs';

const getNumOfAdjacentRolls = (grid: Array<string[]>, x: number, y: number) => {

    
    const NW = x > 0 && y > 0 ? grid[y-1][x-1] : undefined;
    const N = y > 0 ? grid[y-1][x] : undefined;
    const NE = x < grid[y].length - 1 && y > 0 ? grid[y-1][x+1] : undefined;
    const W = x > 0 ? grid[y][x-1] : undefined;
    const E = x < grid[y].length - 1 ? grid[y][x+1] : undefined;
    const SW = x > 0 && y < grid.length - 1 ? grid[y+1][x-1] : undefined;
    const S = y < grid.length - 1 ? grid[y+1][x] : undefined;
    const SE = x < grid[y].length - 1 && y < grid.length - 1 ? grid[y+1][x+1] : undefined;
    
    return [NW,N,NE,W,E,SW,S,SE].reduce((acc, curr) => acc + (curr === '@' ? 1 : 0),0)
    
}

const pickUpRollsInGrid = (grid: Array<string[]>) => {
    let pickedUpRolls: Array<{x:number, y:number}>  = [];
    for(let i = 0; i < grid.length;i++){
        for(let j = 0; j < grid[i].length;j++){
            const adjacentRolls = getNumOfAdjacentRolls(grid, j, i);
            if (adjacentRolls < 4 && grid[i][j] === '@'){
                pickedUpRolls.push({x: j, y: i});
            }
        }
    }
    return pickedUpRolls;
}

const main = () => {
    const file = process.argv[2] || 'input.txt';

    const data = fs.readFileSync(`input/${file}`, {
    encoding: 'utf8',
    flag: 'r',
    });

    const dataArr = data.split('\n').map(line => line.split(''));

    console.log({ file, lineCount: dataArr.length });

    let totalRolls = 0;
    let goAgain = true;
    while(goAgain){
        let rolls = pickUpRollsInGrid(dataArr);

        totalRolls += rolls.length;
        for(const roll of rolls){
            dataArr[roll.y][roll.x] = 'x';
        }

        if (rolls.length <= 0){
            goAgain = false;
        }
    }

    console.log({totalRolls});
}


main();
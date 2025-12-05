import fs from 'fs';

const getNumOfAdjacentRolls = (grid: Array<string>, x: number, y: number) => {

    
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

const main = () => {
    const file = process.argv[2] || 'input.txt';

    const data = fs.readFileSync(`input/${file}`, {
    encoding: 'utf8',
    flag: 'r',
    });

    const dataArr = data.split('\n');

    console.log({ file, lineCount: dataArr.length });

    let rolls = 0;
    for(let i = 0; i < dataArr.length;i++){
        for(let j = 0; j < dataArr[i].length;j++){
            const adjacentRolls = getNumOfAdjacentRolls(dataArr, j, i);
            if (adjacentRolls < 4 && dataArr[i][j] === '@'){
                rolls++;
            }
        }
    }

    console.log({rolls});
}


main();
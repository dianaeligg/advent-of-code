import { describe, it, expect } from 'vitest';
import { countZeroCrossings } from '../2';

describe('2025/1/2', () => {
  it('returns same count when turning right and not passing 100', () => {
    expect(countZeroCrossings({line: 'R40', count: 0, startPosition: 50})).toStrictEqual({newPosition: 90, times: 0})
    expect(countZeroCrossings({line: 'R15', count: 0, startPosition: 50})).toStrictEqual({newPosition: 65, times: 0})
  });
  it('returns same count when turning left and not passing 0', () => {
    expect(countZeroCrossings({line: 'L40', count: 0, startPosition: 50})).toStrictEqual({newPosition: 10, times: 0})
    expect(countZeroCrossings({line: 'L15', count: 0, startPosition: 50})).toStrictEqual({newPosition: 35, times: 0})
  });
  it('returns one more when turning right and landing on 100', () => {
    expect(countZeroCrossings({line: 'R50', count: 0, startPosition: 50})).toStrictEqual({newPosition: 0, times: 1})
  });
  it('returns one more when turning left and landing on 0', () => {
    expect(countZeroCrossings({line: 'L50', count: 0, startPosition: 50})).toStrictEqual({newPosition: 0, times: 1})
  });
  it('returns one more when turning right and passing 100', () => {
    expect(countZeroCrossings({line: 'R75', count: 0, startPosition: 50})).toStrictEqual({newPosition: 25, times: 1})
  });
  it('returns one more when turning left and passing 0', () => {
    expect(countZeroCrossings({line: 'L75', count: 0, startPosition: 50})).toStrictEqual({newPosition: 75, times: 1})
    expect(countZeroCrossings({line: 'L30', count: 0, startPosition: 18})).toStrictEqual({newPosition: 88, times: 1})
  });
  it('returns correctly when turning right for more than 100', () => {
    expect(countZeroCrossings({line: 'R125', count: 0, startPosition: 50})).toStrictEqual({newPosition: 75, times: 1})
    expect(countZeroCrossings({line: 'R175', count: 0, startPosition: 50})).toStrictEqual({newPosition: 25, times: 2})
    expect(countZeroCrossings({line: 'R725', count: 0, startPosition: 50})).toStrictEqual({newPosition: 75, times: 7})
    expect(countZeroCrossings({line: 'R775', count: 0, startPosition: 50})).toStrictEqual({newPosition: 25, times: 8})
    expect(countZeroCrossings({line: 'R963', count: 0, startPosition: 37})).toStrictEqual({newPosition: 0, times: 10})
  });
  it('returns correctly when turning left for more than 100', () => {
    expect(countZeroCrossings({line: 'L125', count: 0, startPosition: 50})).toStrictEqual({newPosition: 25, times: 1})
    expect(countZeroCrossings({line: 'L175', count: 0, startPosition: 50})).toStrictEqual({newPosition: 75, times: 2})
    expect(countZeroCrossings({line: 'L725', count: 0, startPosition: 50})).toStrictEqual({newPosition: 25, times: 7})
    expect(countZeroCrossings({line: 'L775', count: 0, startPosition: 50})).toStrictEqual({newPosition: 75, times: 8})
  });
  it('returns correctly when turning right, landing on 0 and then left', () => {
    const {newPosition: newPosition1, times: times1} = countZeroCrossings({line:'R48', count: 0, startPosition: 52});
    expect({newPosition1, times1}).toStrictEqual({newPosition1: 0, times1: 1});
    const {newPosition, times} = countZeroCrossings({line:'L5', count: times1, startPosition: newPosition1});
    expect({newPosition, times: times1 + times}).toStrictEqual({newPosition: 95, times: 1});
  })
});

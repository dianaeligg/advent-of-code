import { describe, it, expect } from 'vitest';
import { areAllItemsTheSame, breakIntoSameSizeStrings } from '../2';

describe('2025/2/2', () => {
    describe('areAllItemsTheSame', () => {
        it('returns true when all items are the same', () => {
            expect(areAllItemsTheSame(['1', '1'])).toBe(true)
            expect(areAllItemsTheSame(['1223', '1223'])).toBe(true)
            expect(areAllItemsTheSame(['1223', '1223', '1223'])).toBe(true)
            expect(areAllItemsTheSame(['1', '1', '1', '1', '1'])).toBe(true)
        });
        it('returns false when all items are not the same', () => {
            expect(areAllItemsTheSame(['1', '0'])).toBe(false)
            expect(areAllItemsTheSame(['-1', '1'])).toBe(false)
            expect(areAllItemsTheSame(['1', '1', '1', '11', '1'])).toBe(false)
        });
    })
    describe('breakIntoSameSizeStrings', () => {
        it('returns undefined when length and num are the same', () => {
            expect(breakIntoSameSizeStrings('11', 2)).toStrictEqual(undefined)
            expect(breakIntoSameSizeStrings('111', 2)).toStrictEqual(undefined)
        });
        it('returns correctly', () => {
            expect(breakIntoSameSizeStrings('11', 1)).toStrictEqual(['1', '1'])
            expect(breakIntoSameSizeStrings('11222', 1)).toStrictEqual(['1', '1', '2', '2', '2'])
            expect(breakIntoSameSizeStrings('112222', 2)).toStrictEqual(['11', '22', '22'])
            expect(breakIntoSameSizeStrings('112222', 3)).toStrictEqual(['112', '222'])
        });
    })
});
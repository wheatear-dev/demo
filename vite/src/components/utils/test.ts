import { expect } from 'vitest'
import { Hash } from '../types';


function testHash(
    hash: Hash,
    maxLen: number = 20,
    reps: number = 10
) {
    for (let i = 0; i < maxLen; i++) {
        for (let j = 0; j < reps; j++ ) {
            const in_ = Math.random().toString(36).slice(2, 2 + i);
            const expected = hash.refFunc(in_);
            const observed = hash.func(in_);
            expect(observed).toEqual(expected);
        };
    };
};

export default testHash;

import { expect, test } from 'vitest'

import { Bits, Block, Hash } from '.';
import { defaultBitsFunc, defaultStringFunc } from './hash';
import testHash from '../utils/test';


test('defaultStringFunc for simple values', () => {
    const expectedMap: {[in_: Bits]: string} = {
        '1111': 'f',
        '1111111111111110': 'fffe',
        '000000000001': '001',
        '1010101000101110': 'aa2e'
    };

    for (const in_ in expectedMap) {
        const expected = expectedMap[in_];
        const observed = defaultStringFunc(in_);
        expect(observed).toEqual(expected);
    };
});

test('Identity block returns what its given', () => {
    class Identity extends Block<Bits, Bits> {
        func(in_: Bits): Bits {
            return in_;
        };
    };

    const identityBlock = new Identity();
    const decoder = new TextDecoder();
    const identityHash = new Hash(
        'test identity',
        identityBlock,
        s => s,
        {
            toBits: defaultBitsFunc,
            toString: b => decoder.decode(b)
        }
    );

    testHash(identityHash);
});

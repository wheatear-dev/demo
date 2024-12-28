// sum.test.js
import { expect, test } from 'vitest'
import Identity from "./identity";
import { Hash } from './types';
import { defaultBytesFunc } from './types/hash';


test('Identity block returns what its given', () => {
    const identityBlock = new Identity();

    const decoder = new TextDecoder();

    const identityHash = new Hash(
        'test identity',
        identityBlock,
        s => s,
        {
            toBytes: defaultBytesFunc,
            toString: b => decoder.decode(b)
        }
    );

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++ ) {
            const in_ = Math.random().toString(36).slice(2, 2 + i);
            const out_ = identityHash._testForValue(in_);
            expect(out_).toBeUndefined();
        }
    }
});

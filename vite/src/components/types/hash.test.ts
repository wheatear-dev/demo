import { test } from 'vitest'

import { Block, Hash } from '.';
import { defaultBytesFunc } from './hash';
import testHash from '../utils/test';


test('Identity block returns what its given', () => {
    class Identity extends Block<Uint8Array, Uint8Array> {
        func(in_: Uint8Array): Uint8Array {
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
            toBytes: defaultBytesFunc,
            toString: b => decoder.decode(b)
        }
    );

    testHash(identityHash);
});

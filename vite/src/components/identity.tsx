import { Block } from './types';


class Identity extends Block<Uint8Array, Uint8Array> {
    func(in_: Uint8Array): Uint8Array {
        return in_;
    };
};


export default Identity;

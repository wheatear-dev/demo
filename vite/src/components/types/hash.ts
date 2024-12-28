import Block from './block';

type HashFunc = (in_: any) => any;

export default interface Hash<In, Out> {
    /** The name of the hash function */
    name: string

    /** The entrypoint to the hash function */
    root: Block<In, Out>

    /** The hash function - implemented externally */
    libFunc: HashFunc
};

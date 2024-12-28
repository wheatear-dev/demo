import Block from './block';


type HashFunc = (in_: string) => string;
type StringFunc = (in_: Uint8Array) => string;
type BytesFunc = (in_: string) => Uint8Array;
type RootBlock = Block<Uint8Array, Uint8Array>;

interface ConverterProps {
    toString: StringFunc;
    toBytes: BytesFunc;
};

export function defaultStringFunc(in_: Uint8Array): string {
    const split = Array.from(in_);
    const hexSplit = split.map(
        i => i.toString(16).padStart(2, '0')
    );
    return hexSplit.join('');
};

export function defaultBytesFunc(in_: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(in_);
};

const defaultConverterProps: ConverterProps = {
    toString: defaultStringFunc,
    toBytes: defaultBytesFunc
}


class Hash {
    name: string;
    root: RootBlock;
    libFunc: HashFunc;
    toString: StringFunc;
    toBytes: BytesFunc;

    constructor (
        name: string,
        root: RootBlock,
        libFunc: HashFunc,
        converterProps?: ConverterProps
    ) {
        this.name = name;
        this.root = root;
        this.libFunc = libFunc;

        const {
            toString,
            toBytes
        } = this.getConverters(converterProps);

        this.toString = toString;
        this.toBytes = toBytes;
    };

    public func(val: string): string {
        const bytesIn = this.toBytes(val);
        const bytesOut = this.root.func(bytesIn);
        return this.toString(bytesOut);
    };

    private getConverters(
        converterProps?: ConverterProps
    ): ConverterProps {
        const coalescedProps = converterProps ?? defaultConverterProps;

        return {
            ...defaultConverterProps,
            ...coalescedProps
        };
    };
};

export default Hash;

import Block from './block';


export type Bits = string;

type HashFunc = (in_: string) => string;
type StringFunc = (in_: Bits) => string;
type BytesFunc = (in_: string) => Bits;
type RootBlock = Block<Bits, Bits>;

interface ConverterProps {
    toString: StringFunc;
    toBytes: BytesFunc;
};

export function defaultStringFunc(in_: Bits): string {
    const split = in_.match(/.{1,4}/g)
    const hexSplit = split!.map(
        s => Number.parseInt(s, 2).toString(16)
    );
    return hexSplit.join('');
};

export function defaultBitsFunc(in_: string): Bits {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(in_);
    return Array.from(encoded).map(
        b => b.toString(2).padStart(8, '0')
    ).join('');
};

const defaultConverterProps: ConverterProps = {
    toString: defaultStringFunc,
    toBytes: defaultBitsFunc
}


class Hash {
    name: string;
    root: RootBlock;
    refFunc: HashFunc;
    toString: StringFunc;
    toBytes: BytesFunc;

    constructor (
        name: string,
        root: RootBlock,
        refFunc: HashFunc,
        converterProps?: ConverterProps
    ) {
        this.name = name;
        this.root = root;
        this.refFunc = refFunc;

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
        const coalescedProps = converterProps ?? {};
        return {
            ...defaultConverterProps,
            ...coalescedProps
        };
    };
};

export default Hash;

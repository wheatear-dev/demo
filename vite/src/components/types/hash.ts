import Block from './block';


export type Bits = string;
export type Hex = string;

type HashFunc = (in_: string) => string;
type HexFunc = (in_: Bits) => Hex;
type BitsFunc = (in_: string) => Bits;
type RootBlock = Block<Bits, Bits>;

interface ConverterProps {
    toHex: HexFunc;
    toBits: BitsFunc;
};

export function defaultHexFunc(in_: Bits): string {
    const split = in_.match(/..../g)
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
    toHex: defaultHexFunc,
    toBits: defaultBitsFunc
}


class Hash {
    name: string;
    root: RootBlock;
    refFunc: HashFunc;
    toHex: HexFunc;
    toBits: BitsFunc;

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
            toHex: toHex,
            toBits
        } = this.getConverters(converterProps);

        this.toHex = toHex;
        this.toBits = toBits;
    };

    public func(val: string): string {
        const bitsIn = this.toBits(val);
        const bitsOut = this.root.func(bitsIn);
        return this.toHex(bitsOut);
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

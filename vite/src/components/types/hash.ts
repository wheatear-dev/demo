import Block from './block';


type HashFunc = (in_: string) => string;
type StringFunc = (in_: Uint8Array) => string;
type BytesFunc = (in_: string) => Uint8Array;

interface ConverterProps {
    toString: StringFunc;
    toBytes: BytesFunc;
};

interface TestError {
    observed: string;
    expected: string;
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
    root: Block<Uint8Array, Uint8Array>;
    libFunc: HashFunc;
    toString: StringFunc;
    toBytes: BytesFunc;

    constructor (
        name: string,
        root: Block<Uint8Array, Uint8Array>,
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

    public _testForValue(val: string): TestError | undefined {
        const expected = this.libFunc(val);
        const observed = this.applyRootFunc(val);

        if (observed !== expected) {
            return {
                observed: observed,
                expected: expected
            };
        };
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

    private applyRootFunc(val: string): string {
        const bytesIn = this.toBytes(val);
        const bytesOut = this.root.func(bytesIn);
        return this.toString(bytesOut);
    };
};

export default Hash;

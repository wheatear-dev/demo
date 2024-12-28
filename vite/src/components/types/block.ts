abstract class Block<In, Out> {
    abstract func: (in_: In) => Out;
};

export default Block;

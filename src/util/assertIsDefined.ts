//this function will allow us to pass any type to it and then check that this type is not null

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    if(!val) {
        throw Error("Expected 'val' to be defined, but received "+ val);
    }
}
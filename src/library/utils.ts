
// Retrieves an element from the array as if the array was mirrored at its end.
// This variant has no central key – the mirror axis is between two central keys.
// All values are repeated.
// precondition: 0 < index < array.length*2
export function getSymmetricEven<T>(array: T[], index: number): T {
    const i = index >= array.length ? array.length*2 - 1 - index : index;
    return array[i];
}

// Retrieves an element from the array as if the array was mirrored at its end.
// This variant has a central key, the last key from the array is not repeatead.
// precondition: 0 < index < array.length*2 - 1
export function getSymmetricOdd<T>(array: T[], index: number): T {
    const i = index >= array.length ? array.length*2 - 2 - index : index;
    return array[i];
}
export function sum(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

export function frac(x: number): number {
    return x - Math.floor(x);
}
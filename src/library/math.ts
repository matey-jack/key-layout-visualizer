export function sum(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

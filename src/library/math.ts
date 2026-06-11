export function sum(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

export function frac(x: number): number {
    return x - Math.floor(x);
}

export function formatDecimal(amount: number): string {
    return parseFloat(amount.toFixed(2)).toString();
}
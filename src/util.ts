export function add (a: number, b: number) {
    return a + b;
}

export function mul (a: number, b: number) {
    return a * b;
}

export function sum (numbers: number[]) {
    return numbers.reduce(add, 0);
}

export function prod (numbers: number[]) {
    return numbers.reduce(mul, 1);
}

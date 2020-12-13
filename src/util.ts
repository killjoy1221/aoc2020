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

/**
 * Calculates a union set from an array of Sets
 * @param sets The sets to use
 */
export function union<T> (...sets: Set<T>[]): Set<T> {
    return new Set(sets.flatMap(s => [...s]));
}

/**
 * Calculates an intersect set from an array of Sets.
 * @param sets The sets to use
 */
export function intersect<T> (...sets: Set<T>[]): Set<T> {
    if (sets.length === 0) {
        return new Set();
    }
    const first = sets[0];
    sets = sets.slice(1);
    return sets.reduce((a, b) => {
        return new Set([...a].filter(x => b.has(x)));
    }, first);
}

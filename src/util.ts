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

export function comparing<T=number> (getter?: (value: T) => number): (a: T, b: T) => number {
    getter ??= a => a as unknown as number;
    return (a, b) => getter!(a) - getter!(b);
}

/**
 * Calculates a union set from an array of Sets
 * @param sets The sets to use
 */
export function union<T> (sets: Set<T>[]): Set<T> {
    return new Set(sets.flatMap(s => [...s]));
}

/**
 * Calculates an intersect set from an array of Sets.
 * @param sets The sets to use
 */
export function intersect<T> (sets: Set<T>[]): Set<T> {
    if (sets.length === 0) {
        return new Set();
    }
    const first = sets[0];
    sets = sets.slice(1);
    return sets.reduce((a, b) => {
        return new Set([...a].filter(x => b.has(x)));
    }, first);
}

export function combinations<T> (items: T[]): [T, T][] {
    const result: [T, T][] = [];
    for (const i1 in items) {
        for (const i2 in items) {
            if (i1 !== i2) {
                result.push([items[i1], items[i2]]);
            }
        }
    }
    return result;
}

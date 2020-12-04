import { Puzzle } from './index';
import { prod, sum } from '../util';

export class Day1 implements Puzzle {
    private readonly data: number[];

    constructor (buffer: Buffer) {
        this.data = buffer.toString('utf-8')
            .split('\n')
            .filter(x => x)
            .map(x => parseInt(x));
    }

    solvePart1 () {
        this.run(2);
    }

    solvePart2 () {
        this.run(3);
    }

    private run (combos: number) {
        const indexes = this.findNumbers(combos, 2020);
        if (indexes === null) {
            throw new Error('no data found');
        }

        const values = this.resolveIndexes(indexes);
        console.log(`prod(${values}) = ${prod(values)}`);
    }

    private findNumbers (combos: number, target: number): number[] | null {
        const indexes = new Array<number>(combos);
        const values = new Array<number>(combos);
        for (let x = 0; x < Math.pow(this.data.length, combos); x++) {
            for (let i = 0; i < combos; i++) {
                let index = x;
                for (let j = 0; j < i; j++) {
                    index /= this.data.length;
                }
                indexes[i] = index % this.data.length;
            }
            if (new Set(indexes).size !== indexes.length) {
                continue;
            }
            this.resolveIndexes(indexes, values);
            if (sum(values) === target) {
                return indexes;
            }
        }
        return null;
    }

    private resolveIndexes (indexes: number[], values?: number[]): number[] {
        if (values === undefined) {
            values = new Array<number>(indexes.length);
        }
        for (const i in indexes) {
            values[i] = this.data[indexes[i]];
        }
        return values;
    }
}

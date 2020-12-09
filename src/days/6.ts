import { Puzzle } from '../index';
import { intersect, sum, union } from '../util';

const testData = `\
abc

a
b
c

ab
ac

a
a
a
a

b
`;

export class Day6 implements Puzzle {
    private readonly data: Set<string>[][];

    constructor (buffer?: Buffer) {
        this.data = (buffer ?? testData).toString('utf-8').trim()
            .split(/(\r?\n){2}/)
            .map(s => s.trim())
            .filter(s => s)
            .map(s => s.split(/\r?\n/).map(s => new Set(s)));
    }

    solvePart1 (): void {
        // union of sets
        const unions = this.data.map(union);
        console.log(sum(unions.map(group => group.size)));
    }

    solvePart2 (): void {
        // intersect of sets
        const intersects = this.data.map(intersect);
        console.log(sum(intersects.map(group => group.size)));
    }
}

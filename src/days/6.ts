import { AbstractPuzzle } from '../index';
import { intersect, sum, union } from '../util';

export class Day6 extends AbstractPuzzle<Set<string>[][]> {
    protected parseData (input: string) {
        return input.split(/(\r?\n){2}/)
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

    protected getTestData () {
        return testData;
    }
}

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

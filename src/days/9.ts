import { Puzzle } from '../index';
import { combinations, sum } from '../util';
import assert from 'assert';

export class Day9 implements Puzzle {
    private readonly data: number[]
    private readonly preamble: number

    private invalidNumber?: number

    constructor (buffer: Buffer) {
        this.data = (buffer ?? testData).toString('utf-8').trim()
            .split(/\r?\n/)
            .map(l => parseInt(l));
        this.preamble = buffer ? 25 : 5;
    }

    getData (indx: number): [number[], number] {
        return [this.data.slice(indx - this.preamble, indx), this.data[indx]];
    }

    solvePart1 (): void {
        for (let i = this.preamble; i < this.data.length; i++) {
            const [preamble, number] = this.getData(i);
            const sums = combinations(preamble).map(sum);
            if (!sums.includes(number)) {
                console.log(number);
                this.invalidNumber = number;
                break;
            }
        }
    }

    solvePart2 (): void {
        if (this.invalidNumber === undefined) {
            // part 1 is required
            this.solvePart1();
            assert(this.invalidNumber !== undefined);
        }
        for (let start = 0; start < this.data.length - 1; start++) {
            // find the contiguous numbers that add up to the invalid number
            let count = 0;
            let indx = start;
            while (indx < this.data.length && count < this.invalidNumber) {
                count += this.data[indx++];
            }
            if (count === this.invalidNumber) {
                // calculate min and max of the numbers, and add them.
                const numbers = this.data.slice(start, indx);
                const min = Math.min(...numbers);
                const max = Math.max(...numbers);
                console.log(min + max);
                break;
            }
        }
    }
}

const testData = `\
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`;

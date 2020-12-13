import { IntArrayPuzzle } from '../index';
import { prod } from '../util';

export class Day10 extends IntArrayPuzzle {
    protected parseData (input: string): number[] {
        return super.parseData(input).sort((a, b) => a - b);
    }

    private useAllAdapters (): Record<1 | 2 | 3, number> {
        const diffs: Record<1 | 2 | 3, number> = {
            1: 0,
            2: 0,
            3: 1
        };
        let jolts = 0;
        for (const item of this.data) {
            const diff = item - jolts;
            diffs[diff as 1 | 2 | 3]++;
            jolts = item;
        }
        return diffs;
    }

    solvePart1 (): void {
        const diffs = this.useAllAdapters();
        console.log(diffs[1] * diffs[3]);
    }

    private findAllCombinations (): number[] {
        // divide the adapters into sections divided by 3 jolts
        const sections: number[][] = [];
        let section: number[] = [0];
        let jolts = 0;
        for (const item of this.data) {
            const diff = item - jolts;
            if (diff === 3) {
                if (section.length > 1) {
                    sections.push([...section, item]);
                }
                section = [item];
            } else {
                section.push(item);
            }
            jolts = item;
        }
        if (section.length > 1) {
            sections.push([...section, Math.max(...this.data) + 3]);
        }
        return sections.map(section => {
            return this.findCombos(section).size;
        });
    }

    private findCombos (adapters: number[]): Set<string> {
        const result = new Set<string>();
        let jolts = adapters[0];
        for (let i = 1; i < adapters.length; i++) {
            const diff = adapters[i] - jolts;
            if (diff > 3) return new Set();
            if (diff < 3) {
                const array = [...adapters];
                array.splice(i, 1);
                this.findCombos(array)
                    .forEach(result.add.bind(result));
            }
            jolts = adapters[i];
        }
        result.add(adapters.join(','));
        return result;
    }

    solvePart2 (): void {
        const sets = this.findAllCombinations();
        console.log(prod(sets));
    }

    protected getTestData (): string {
        return testData;
    }
}

const testData = `\
16
10
15
5
1
11
7
19
6
12
4
`;

const testData2 = `\
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
`;

import { Puzzle } from '../index';
import { prod } from '../util';

export class Day3 implements Puzzle {
    private readonly data: string[][]

    constructor (buffer?: Buffer) {
        this.data = (buffer ?? testData).toString('utf-8')
            .split(/\r?\n/)
            .map(s => s.split(''));
    }

    solvePart1 () {
        const trees = this.traverse(3, 1);
        console.log(trees);
    }

    solvePart2 () {
        const slopes = [
            this.traverse(1, 1),
            this.traverse(3, 1),
            this.traverse(5, 1),
            this.traverse(7, 1),
            this.traverse(1, 2)
        ];
        const product = prod(slopes);
        console.log(product);
    }

    private traverse (right: number, down: number): number {
        let trees = 0;
        for (let x = 0, y = 0; y < this.data.length; x += right, y += down) {
            const row = this.data[y];
            if (row[x % row.length] === '#') {
                trees++;
            }
        }
        return trees;
    }
}

const testData = `\
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
`;

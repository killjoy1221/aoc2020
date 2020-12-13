import { Puzzle, readArray } from '../index';

interface Password {
    first: number
    second: number
    letter: string
    password: string
}

function parseSingleData (input: string) {
    const [firstStr, secondStr, letter, password] = /^(\d+)-(\d+) (\w): (.+)$/.exec(input)!.slice(1);
    const first = parseInt(firstStr);
    const second = parseInt(secondStr);
    return { first, second, letter, password } as Password;
}

export class Day2 implements Puzzle {
    private readonly data: Password[]

    constructor (buffer?: Buffer) {
        this.data = readArray(buffer ?? testData, parseSingleData);
    }

    private handleData (func: (input: Password) => boolean): { valid: number, invalid: number } {
        let valid = 0;
        let invalid = 0;
        for (const passwd of this.data) {
            if (func(passwd)) {
                valid++;
            } else {
                invalid++;
            }
        }
        return { valid, invalid };
    }

    solvePart1 () {
        console.log(this.handleData(({ first, second, letter, password }) => {
            const validLength = password.replace(new RegExp(`[^${letter}]`, 'g'), '').length;
            return validLength >= first && validLength <= second;
        }));
    }

    solvePart2 () {
        console.log(this.handleData(({ first, second, letter, password }) => {
            const firstLetter = password.charAt(first - 1);
            const secondLetter = password.charAt(second - 1);
            return (firstLetter === letter || secondLetter === letter) && firstLetter !== secondLetter;
        }));
    }
}

const testData = `\
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
`;

import { Puzzle } from '../index';

const testData = `\
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
`;

interface Password {
    first: number
    second: number
    letter: string
    password: string
}

export class Day2 implements Puzzle {
    private readonly data: ReadonlyArray<Password>

    constructor (buffer?: Buffer) {
        this.data = (buffer ?? testData).toString('utf-8').trim()
            .split(/\r?\n/)
            .map(line => {
                const [firstStr, secondStr, letter, password] = /^(\d+)-(\d+) (\w): (.+)$/.exec(line)!.slice(1);
                const first = parseInt(firstStr);
                const second = parseInt(secondStr);
                return { first, second, letter, password } as Password;
            });
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

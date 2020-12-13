import { Puzzle } from '../index';

const ZERO = /[FL]/g;
const ONE = /[BR]/g;

class BoardingPass {
    sid: number
    row: number
    col: number

    constructor (sid: number) {
        this.sid = sid;
        this.row = Math.floor(sid / 8);
        this.col = sid % 8;
    }
}

function parseBoardingPass (line: string): BoardingPass {
    return new BoardingPass(translateBinary(line));
}

function translateBinary (text: string) {
    const digits = [ZERO, ONE];
    for (const search in digits) {
        text = text.replace(digits[search], search.toString());
    }
    return parseInt(text, digits.length);
}

export class Day5 implements Puzzle {
    // a sorted list of boarding passes
    private readonly data: BoardingPass[]

    constructor (buffer?: Buffer) {
        this.data = (buffer ?? testData).toString('utf-8').trim()
            .split(/\r?\n/)
            .map(parseBoardingPass)
            .sort((a, b) => a.sid - b.sid);
    }

    solvePart1 () {
        // highest seat id
        console.log(this.data[this.data.length - 1]);
    }

    solvePart2 (): void {
        // find the unoccupied seat
        let prevSid = this.data[0].sid - 1;
        for (const pass of this.data) {
            if (pass.sid - 1 !== prevSid) {
                console.log(new BoardingPass(prevSid + 1));
                break;
            }
            prevSid = pass.sid;
        }
    }
}

const testData = `\
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL
`;

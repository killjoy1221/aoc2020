import { Puzzle, readArray } from '../index';

type Global = {
    offset: number
    accumulator: number
    complete: boolean
    visited: Set<number>
}

type Op = 'acc' | 'jmp' | 'nop'
type Operation = (global: Global, value: number) => void
type Operations = Record<Op, Operation>

const operations: Operations = {
    acc (global, value) {
        global.accumulator += value;
    },
    jmp (global, value) {
        global.offset += value - 1;
    },
    nop () {
    }
};

class Instruction {
    readonly operation: Operation
    readonly value: number
    toggleJmpOrNop: boolean = false

    constructor (operation: Operation, value: number) {
        this.operation = operation;
        this.value = value;
    }

    exec (global: Global) {
        let op = this.operation;
        if (this.toggleJmpOrNop) {
            switch (op.name) {
            case 'jmp':
                op = operations.nop;
                break;
            case 'nop':
                op = operations.jmp;
            }
        }
        op(global, this.value);
    }
}

export class Day8 implements Puzzle {
    private readonly data: Instruction[];

    constructor (buffer?: Buffer) {
        this.data = readArray(buffer ?? testData, input => {
            const [op, val] = input.split(' ');
            return new Instruction(operations[op as Op], parseInt(val));
        });
    }

    private runProgram () {
        const global: Global = {
            offset: 0,
            accumulator: 0,
            complete: false,
            visited: new Set()
        };
        while (global.offset < this.data.length) {
            if (global.visited.has(global.offset)) {
                return global;
            }
            global.visited.add(global.offset);
            this.data[global.offset].exec(global);
            global.offset++;
        }
        global.complete = true;
        return global;
    }

    solvePart1 (): void {
        const global = this.runProgram();
        console.log(global.accumulator);
    }

    solvePart2 (): void {
        const globals = [...this.runProgram().visited]
            .map(i => this.data[i])
            .filter(inst => inst.operation !== operations.acc)
            .map(inst => {
                inst.toggleJmpOrNop = true;
                const globals = this.runProgram();
                inst.toggleJmpOrNop = false;
                return globals;
            }).find(g => g.complete)!;
        console.log(globals.accumulator);
    }
}

const testData = `\
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`;

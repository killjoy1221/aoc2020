import { readFile } from 'fs/promises';

const NEW_LINE = /\r?\n/;

export interface Puzzle {

    solvePart1(): void;

    solvePart2(): void;
}

export abstract class AbstractPuzzle<T> implements Puzzle {
    protected readonly data: Readonly<T>
    protected constructor (buffer?: Buffer) {
        this.data = this.parseData((buffer?.toString('utf-8') ?? this.getTestData()).trim());
    }

    protected abstract parseData(input: string): T

    protected abstract getTestData(): string

    abstract solvePart1(): void;

    abstract solvePart2(): void;
}

export abstract class ArrayPuzzle<T> extends AbstractPuzzle<ReadonlyArray<T>> {
    protected abstract parseSingleData(input: string): T

    protected parseData (input: string): T[] {
        return input.split(NEW_LINE)
            .map(line => this.parseSingleData(line));
    }
}

export abstract class IntArrayPuzzle extends ArrayPuzzle<number> {
    protected parseSingleData (input: string): number {
        return parseInt(input);
    }
}

export interface PuzzleConstructor {
    new(buffer?: Buffer): Puzzle
}

export async function loadPuzzle (day: string, test: boolean) {
    try {
        const puzzle = await import(`./days/${day}`);
        const Puzzle = puzzle[`Day${day}`] as PuzzleConstructor;
        return new Puzzle(test ? undefined : await loadInput(day));
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            return undefined;
        }
        throw e;
    }
}

async function loadInput (day: string): Promise<Buffer> {
    return await readFile(`inputs/${day}.txt`);
}

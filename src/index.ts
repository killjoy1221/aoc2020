import { readFile } from 'fs/promises';

const NEW_LINE = /\r?\n/;

export interface Puzzle {

    solvePart1(): void;

    solvePart2(): void;
}

export function readArray<T = string> (buffer: Buffer|string, mapper?: (s: string) => T) {
    mapper ??= (s) => s as unknown as T;
    return buffer.toString('utf-8').trim().split(NEW_LINE).map(mapper);
}

export function readIntArray (buffer: Buffer|string) {
    return readArray(buffer, s => parseInt(s));
}

export function readMatrix<T = string> (buffer: Buffer|string, mapper?: (s: string) => T) {
    mapper ??= (s) => s as unknown as T;
    return readArray(buffer, s => s.split('').map(mapper!));
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

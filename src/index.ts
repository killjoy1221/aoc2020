import { readFile } from 'fs/promises';

export interface Puzzle {
    solvePart1(): void;

    solvePart2(): void;
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

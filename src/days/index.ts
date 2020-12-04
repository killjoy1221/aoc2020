import { Day1 } from './1';
import { Day2 } from './2';
import { Day3 } from './3';
import { Day4 } from './4';

export interface Puzzle {
  solvePart1(): void;

  solvePart2(): void;
}

export interface PuzzleConstructor {
  new(buffer: Buffer): Puzzle
}

export namespace Puzzles {
    const puzzles: Readonly<Record<string, PuzzleConstructor>> = {
        1: Day1,
        2: Day2,
        3: Day3,
        4: Day4
    };

    export function get (day: string) {
        return puzzles[day];
    }
}

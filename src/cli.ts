#!/usr/bin/env node
import { loadPuzzle } from './index';

require('source-map-support').install();

async function main () {
    if (process.argv.length < 3) {
        console.log('No arguments provided');
        return 1;
    }
    const day = process.argv[2];
    const puzzle = await loadPuzzle(day);
    if (puzzle === undefined) {
        console.log('day', day, "doesn't exist (yet)");
        return 2;
    }
    console.log('PART 1');
    puzzle.solvePart1();
    console.log('PART 2');
    puzzle.solvePart2();
}

main()
    .then(process.exit)
    .catch((e) => {
        console.error(e);
        process.exit(3);
    });

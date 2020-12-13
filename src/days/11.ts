import { Puzzle } from '../index';

type SeatStatus = '.' | '#' | 'L';

const FLOOR: SeatStatus = '.';
const OCCUPIED: SeatStatus = '#';
const EMPTY: SeatStatus = 'L';

/**
 * Object containing x and y values for a grid
 */
class Pos {
    readonly x: number;
    readonly y: number;

    constructor (...coord: [number, number]) {
        [this.x, this.y] = coord;
    }

    /**
     * Checks that this pos is inside the given bounds, with 0 being the min.
     * @param maxX Maximum x pos
     * @param maxY Maximum y pos
     * @returns true if this pos is valid
     */
    checkBounds (maxX: number, maxY: number): boolean {
        return this.x >= 0 && this.x < maxX && this.y >= 0 && this.y < maxY;
    }

    /**
     * Returns a new pos with the given values added.
     * @param x
     * @param y
     */
    add (x: number, y: number) {
        return new Pos(this.x + x, this.y + y);
    }

    /**
     * Returns the pos directly above this one.
     */
    up () {
        return this.add(0, -1);
    }

    /**
     * Returns the pos directly below this one.
     */
    down () {
        return this.add(0, 1);
    }

    /**
     * Returns the pos directly left of this one.
     */
    left () {
        return this.add(-1, 0);
    }

    /**
     * Returns the pos directly right of this one.
     */
    right () {
        return this.add(1, 0);
    }

    toString () {
        return `{x: ${this.x}, y: ${this.y}}`;
    }
}

class SeatLayout {
    private readonly layout: SeatStatus[][];

    constructor (layout: SeatStatus[][]) {
        this.layout = layout;
    }

    get height (): number {
        return this.layout.length;
    }

    get width () {
        return this.layout[0].length;
    }

    /**
     * An array of coordinates in the layout.
     */
    get coords (): Pos[] {
        const coords: Pos[] = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const pos = new Pos(x, y);
                if (!this.isFloor(pos)) {
                    coords.push(pos);
                }
            }
        }
        return coords;
    }

    /**
     * Gets the number of occupied seats adjacent to the given one.
     * @param pos
     * @private
     */
    private getOccupiedAdjacentSeats (pos: Pos): number {
        if (this.isFloor(pos)) {
            return -1;
        }
        let count = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                if (this.isOccupied(pos.add(i, j))) {
                    count++;
                }
            }
        }
        return count;
    }

    private findVisibleSeat (start: Pos, dx: number, dy: number) {
        for (let pos = start; pos.checkBounds(this.width, this.height); pos = pos.add(dx, dy)) {
            if (this.isEmpty(pos)) {
                return 0;
            }
            if (this.isOccupied(pos)) {
                return 1;
            }
        }
        return 0;
    }

    /**
     * Finds and counts the occupied visible seats from a position. Seats are
     * visible in a Queen's move.
     *
     * @param pos The starting position*
     * @see http://www.learnchessrules.com/queens.htm
     */
    private getOccupiedVisibleSeats (pos: Pos): number {
        if (this.isFloor(pos)) {
            return -1;
        }
        let count = 0;
        count += this.findVisibleSeat(pos.left(), -1, 0); // left
        count += this.findVisibleSeat(pos.up().left(), -1, -1); // up left
        count += this.findVisibleSeat(pos.up(), 0, -1); // up
        count += this.findVisibleSeat(pos.up().right(), 1, -1); // up right
        count += this.findVisibleSeat(pos.right(), 1, 0); // right
        count += this.findVisibleSeat(pos.down().right(), 1, 1); // down right
        count += this.findVisibleSeat(pos.down(), 0, 1); // down
        count += this.findVisibleSeat(pos.down().left(), -1, 1); // down left
        return count;
    }

    getOccupiedAdjacents (): Record<string, number> {
        return Object.fromEntries(this.coords.map(c => [c.toString(), this.getOccupiedAdjacentSeats(c)]));
    }

    getOccupiedVisibles (): Record<string, number> {
        return Object.fromEntries(this.coords.map(c => [c.toString(), this.getOccupiedVisibleSeats(c)]));
    }

    countOccupied () {
        return this.coords.filter(c => this.isOccupied(c)).length;
    }

    private getSeat ({ x, y }: Pos): SeatStatus | undefined {
        if (y in this.layout && x in this.layout[y]) {
            return this.layout[y][x];
        }
    }

    private setSeat ({ x, y }: Pos, value: SeatStatus) {
        this.layout[y][x] = value;
    }

    isFloor (pos: Pos) {
        return this.getSeat(pos) === FLOOR;
    }

    isOccupied (pos: Pos) {
        return this.getSeat(pos) === OCCUPIED;
    }

    setOccupied (pos: Pos) {
        if (!this.isFloor(pos)) {
            this.setSeat(pos, OCCUPIED);
        }
    }

    isEmpty (pos: Pos) {
        return this.getSeat(pos) === EMPTY;
    }

    setEmpty (pos: Pos) {
        if (!this.isFloor(pos)) {
            this.setSeat(pos, EMPTY);
        }
    }

    toString () {
        return this.layout.map(s => s.join('')).join('\n');
    }

    clone () {
        return new SeatLayout(this.layout.map(s => [...s]));
    }
}

export class Day11 implements Puzzle {
    private readonly data: SeatLayout;

    constructor (buffer?: Buffer) {
        this.data = new SeatLayout((buffer ?? testData).toString('utf-8').trim()
            .split(/\r?\n/)
            .map(s => s.split('') as SeatStatus[]));
    }

    private fillSeats (tolerance: number, occupiedFunc: (seats: SeatLayout) => Record<string, number>) {
        // save a copy of the original data
        const seats = this.data.clone();
        // keep track of the changes made.
        let changed;
        do {
            changed = false;
            // calculate all the occupied values before any changes
            const occupieds = occupiedFunc(seats);
            for (const coord of seats.coords) {
                const adjacent = occupieds[coord.toString()];
                if (seats.isEmpty(coord) && adjacent === 0) {
                    // set to occupied if empty and has no adjacent
                    seats.setOccupied(coord);
                    changed = true;
                } else if (seats.isOccupied(coord) && adjacent >= tolerance) {
                    // set to empty if occupied and has 4+ adjacent
                    seats.setEmpty(coord);
                    changed = true;
                }
            }
        } while (changed);

        return seats.countOccupied();
    }

    solvePart1 () {
        const occupied = this.fillSeats(4, s => s.getOccupiedAdjacents());
        console.log(occupied);
    }

    solvePart2 () {
        const occupied = this.fillSeats(5, s => s.getOccupiedVisibles());
        console.log(occupied);
    }
}

const testData = `\
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`;

import { Puzzle, readArray } from '..';

type Cardinal = 'N' | 'S' | 'E' | 'W';
type Action = Cardinal | 'L' | 'R' | 'F';

type Step = {
    action: Action
    magnitude: number
}

type Vec2 = {
    x: number
    y: number
}

type Ship = {
    heading?: Cardinal
    position: Vec2
    waypoint?: Vec2
}

type ShipPart1 = Required<Pick<Ship, 'position' | 'heading'>>
type ShipPart2 = Required<Pick<Ship, 'position' | 'waypoint'>>

const COMPASS: Cardinal[] = ['N', 'E', 'S', 'W'];

/**
 * Rotates a cardinal direction and returns the new one.
 */
function rotate (dir: Cardinal, turn: 1 | -1): Cardinal {
    const indx = (COMPASS.indexOf(dir) + turn + COMPASS.length) % COMPASS.length;
    return COMPASS[indx];
}

/**
 * The step actions for part 1
 */
const part1: Record<Action, (ship: ShipPart1, mag: number) => void> = {
    N (ship, mag) {
        // move the ship north
        ship.position.y += mag;
    },
    S (ship, mag) {
        // move the ship south
        ship.position.y -= mag;
    },
    E (ship, mag) {
        // move the ship east
        ship.position.x += mag;
    },
    W (ship, mag) {
        // move the ship west
        ship.position.x -= mag;
    },
    L (ship, mag) {
        // rotate the ship left
        const count = mag / 90;
        for (let i = 0; i < count; i++) {
            ship.heading = rotate(ship.heading, -1);
        }
    },
    R (ship, mag) {
        // rotate the ship right
        const count = mag / 90;
        for (let i = 0; i < count; i++) {
            ship.heading = rotate(ship.heading, +1);
        }
    },
    F (ship, mag) {
        // move the ship in the current direction
        this[ship.heading](ship, mag);
    }
};

/**
 * The step actions for part 2
 */
const part2: Record<Action, (ship: ShipPart2, mag: number) => void> = {
    N (ship, mag) {
        // move the waypoint north
        ship.waypoint.y += mag;
    },
    S (ship, mag) {
        // move the waypoint south
        ship.waypoint.y -= mag;
    },
    E (ship, mag) {
        // move the waypoint east
        ship.waypoint.x += mag;
    },
    W (ship, mag) {
        // move the waypoint west
        ship.waypoint.x -= mag;
    },
    L (ship, mag) {
        // rotate the waypoint counter-clockwise
        let { x, y } = ship.waypoint;
        const count = mag / 90;
        for (let i = 0; i < count; i++) {
            // rotate counter-clockwise
            [x, y] = [-y, x];
        }
        ship.waypoint = { x, y };
    },
    R (ship, mag) {
        // rotate the waypoint clockwise
        let { x, y } = ship.waypoint;
        const count = mag / 90;
        for (let i = 0; i < count; i++) {
            // rotate clockwise
            [x, y] = [y, -x];
        }
        ship.waypoint = { x, y };
    },
    F (ship, mag) {
        // move the ship towards the waypoint
        ship.position.x += ship.waypoint.x * mag;
        ship.position.y += ship.waypoint.y * mag;
    }
};

export class Day12 implements Puzzle {
    private readonly data: Step[];

    constructor (buffer?: Buffer) {
        this.data = readArray(buffer ?? testData,
            line => {
                // action is the first char. magnitude is the remaining
                const action = line.charAt(0) as Action;
                const magnitude = parseInt(line.slice(1));
                return { action, magnitude };
            });
    }

    solvePart1 (): void {
        const ship: ShipPart1 = { position: { x: 0, y: 0 }, heading: 'E' };
        for (const s of this.data) {
            part1[s.action](ship, s.magnitude);
        }
        console.log(Math.abs(ship.position.x) + Math.abs(ship.position.y));
    }

    solvePart2 (): void {
        const ship: ShipPart2 = { position: { x: 0, y: 0 }, waypoint: { x: 10, y: 1 } };
        for (const s of this.data) {
            part2[s.action](ship, s.magnitude);
        }
        console.log(Math.abs(ship.position.x) + Math.abs(ship.position.y));
    }
}

const testData = `\
F10
N3
F7
R90
F11
`;

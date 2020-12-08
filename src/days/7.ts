import { Puzzle } from '../index';

const testData = `\
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
`;

const RULE_REG = /^(?<name>.+) bags contain (?:(?<none>no other bags)|(?<content>.+?))\.$/;
const BAG_REG = /^(?<bagCount>\d+) (?<type>.+) bags?$/;

type Rule = {
    type: string
    count: number
}

type Rules = {
    [name: string]: Rule[]
}

export class Day7 implements Puzzle {
    private readonly data: Rules;

    constructor (buffer?: Buffer) {
        this.data = Object.fromEntries(
            (buffer ?? testData).toString('utf-8').trim()
                .split(/\r?\n/)
                .map(line => {
                    const match = RULE_REG.exec(line)!;
                    const { name, none, content } = match.groups!;
                    if (none !== undefined) {
                        return [name, []];
                    }
                    return [name, content
                        .split(', ')
                        .map(c => {
                            const match = BAG_REG.exec(c)!;
                            const { bagCount, type } = match.groups!;
                            const count = parseInt(bagCount);
                            return { type, count } as Rule;
                        })
                    ];
                })
        );
    }

    private findTargetBag (type: string) {
        return Object.entries(this.data).filter(([bag, rules]) => {
            return rules.find(rule => rule.type === type);
        }).map(([bag]) => bag);
    }

    private findBags (type: string): string[] {
        const result = this.findTargetBag(type);
        return [...new Set([...result, ...result.flatMap(bag => {
            return this.findBags(bag);
        })])];
    }

    private countBags (type: string): number {
        return this.data[type].reduce((total, bag) => {
            return total + bag.count + bag.count * this.countBags(bag.type);
        }, 0);
    }

    solvePart1 (): void {
        const bags = this.findBags('shiny gold');
        console.log(bags.length);
    }

    solvePart2 (): void {
        const bags = this.countBags('shiny gold');
        console.log(bags);
    }
}

import { Puzzle } from './index';

interface Passport {
    byr: string
    iyr: string
    eyr: string
    hgt: string
    hcl: string
    ecl: string
    pid: string
    cid?: string
}

const fields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid'
];

type Predicate = (value: string) => boolean;

const checks: Readonly<Record<keyof Passport, Predicate>> = {
    byr: checkYear(1920, 2002),
    iyr: checkYear(2010, 2020),
    eyr: checkYear(2020, 2030),
    hgt: checkHeight,
    hcl: (value) => /^#[0-9a-f]{6}$/i.test(value),
    ecl: (value) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(value),
    pid: (value) => /^\d{9}$/.test(value),
    cid: () => true
};

function passportContainsAllRequiredFields (pass: Partial<Passport>) {
    const keys = new Set(Object.keys(pass));
    return !fields.map((key) => keys.has(key)).includes(false);
}

function passportRequiredFieldsAreValid (pass: Passport): boolean {
    try {
        for (const [key, val] of Object.entries(checks)) {
            check(pass[key as keyof Passport]!, val);
        }
        return true;
    } catch (e) {
        return false;
    }
}

function check (value: string, func: (value: string) => boolean) {
    if (func(value)) {
        return;
    }
    throw new Error();
}

function checkHeight (value: string) {
    const match = /^(?<height>\d+)(?<unit>cm|in)$/.exec(value);
    if (match) {
        const { height, unit } = match.groups!;
        const hgt = parseInt(height);
        switch (unit) {
        case 'in':
            return hgt >= 59 && hgt <= 76;
        case 'cm':
            return hgt >= 150 && hgt <= 193;
        }
    }
    return false;
}

function checkYear (minYear: number, maxYear: number) {
    return (value: string) => {
        const year = parseInt(value);
        return year >= minYear && year <= maxYear;
    };
}

export class Day4 implements Puzzle {
    private readonly data: Partial<Readonly<Passport>>[]

    constructor (buffer: Buffer) {
        this.data = buffer.toString('utf-8')
            .split(/(\r?\n){2}/)
            .map((section) => section.replace(/\s+/g, ' ').trim())
            .filter((a) => a)
            .map((section) => {
                const pass = {} as Passport;
                section.split(/\s/).forEach((part) => {
                    const [key, val] = part.split(':');
                    pass[key as keyof Passport] = val;
                });
                return pass;
            });
    }

    solvePart1 (): void {
        console.log(this.data
            .filter(passportContainsAllRequiredFields)
            .length);
    }

    solvePart2 (): void {
        console.log(this.data
            .filter(passportContainsAllRequiredFields)
            .filter((pass) => passportRequiredFieldsAreValid(pass as Passport))
            .length);
    }
}

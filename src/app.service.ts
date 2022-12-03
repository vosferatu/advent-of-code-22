import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  private readonly BASE_DIR = 'input';

  getHello(): string {
    return 'Hello World!';
  }

  readInput = (filename: string, separator = '\n') => {
    return fs
      .readFileSync(`./${this.BASE_DIR}/${filename}`)
      .toString()
      .split(separator);
  };

  runProblem(day: number, part: number, demo?: string): number {
    const runProblemFunctionName = `runProblem${day}Part${part}`;
    const solver = new Solver();

    const input = this.readInput(`day${day}${demo ? '_demo' : ''}.in`);

    console.time('solving');
    const result: number =
      solver[runProblemFunctionName as keyof Solver](input);
    console.timeEnd('solving');

    return result;
  }
}

class Solver {
  runProblem3Part2(inputString: string[]): number {
    const charToCode = (char: string): number => {
      const A = 'A'.charCodeAt(0);
      const a = 'a'.charCodeAt(0);

      if (char == char.toLowerCase()) {
        return char.charCodeAt(0) - a + 1;
      }

      return char.charCodeAt(0) - A + 27;
    };
    const getCommonChar = (s1: string, s2: string, s3: string): string => {
      for (const i of s1) {
        if (s2.includes(i) && s3.includes(i)) return i.toString();
      }
      return '';
    };
    let result = 0;

    do {
      const group = inputString.splice(0, 3);

      result += charToCode(getCommonChar(group[0], group[1], group[2]));
    } while (inputString.length > 0);

    return result;
  }

  runProblem3Part1(inputString: string[]): number {
    const charToCode = (char: string): number => {
      const A = 'A'.charCodeAt(0);
      const a = 'a'.charCodeAt(0);

      if (char == char.toLowerCase()) {
        return char.charCodeAt(0) - a + 1;
      }

      return char.charCodeAt(0) - A + 27;
    };
    const getCommonChar = (s1: string, s2: string): string => {
      for (const i of s1) {
        if (s2.includes(i)) return i.toString();
      }
      return '';
    };
    let result = 0;

    for (const line of inputString) {
      const partOne = line.slice(0, line.length / 2);
      const partTwo = line.slice(line.length / 2, line.length);

      result += charToCode(getCommonChar(partOne, partTwo));
    }

    return result;
  }

  runProblem2Part2(inputString: string[]): number {
    const input: { opponent: string; me: string }[] = inputString.map(
      (entry) => {
        const [opponent, me] = entry.split(' ');
        return { opponent, me };
      },
    );

    interface Map {
      [key: string]: number | undefined;
    }

    let total = 0;
    const outcomeMap: Map = {
      AX: 3,
      AY: 4,
      AZ: 8,
      BX: 1,
      BY: 5,
      BZ: 9,
      CX: 2,
      CY: 6,
      CZ: 7,
    };

    for (const { opponent, me } of input) {
      const key = `${opponent}${me}`;
      total += outcomeMap[key] ?? 0;
    }

    return total;
  }

  runProblem2Part1(inputString: string[]): number {
    const input: { opponent: string; me: string }[] = inputString.map(
      (entry) => {
        const [opponent, me] = entry.split(' ');
        return { opponent, me };
      },
    );

    interface Map {
      [key: string]: number | undefined;
    }

    let total = 0;
    const outcomeMap: Map = {
      AX: 4,
      AY: 8,
      AZ: 3,
      BX: 1,
      BY: 5,
      BZ: 9,
      CX: 7,
      CY: 2,
      CZ: 6,
    };

    for (const { opponent, me } of input) {
      const key = `${opponent}${me}`;
      total += outcomeMap[key] ?? 0;
    }

    return total;
  }

  runProblem1Part2(inputString: string[]): number {
    const input = inputString.map((entry) => Number(entry));

    const elfCalories = [];
    let currentCalories = 0;

    for (const calories of input) {
      if (calories === 0) {
        elfCalories.push(currentCalories);
        currentCalories = 0;
      }

      currentCalories += calories;
    }

    elfCalories.push(currentCalories);

    return elfCalories
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a + b, 0);
  }

  runProblem1Part1(inputString: string[]): number {
    const input = inputString.map((entry) => Number(entry));
    let mostCalories = 0;
    let currentCalories = 0;

    for (const calories of input) {
      if (calories === 0) {
        mostCalories =
          mostCalories > currentCalories ? mostCalories : currentCalories;
        currentCalories = 0;
      }

      currentCalories += calories;
    }

    return mostCalories;
  }
}

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

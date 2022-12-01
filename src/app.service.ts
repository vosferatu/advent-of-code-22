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

  runProblem(day: number, part: number): number {
    const runProblemFunctionName = `runProblem${day}Part${part}`;
    const solver = new Solver();

    const input = this.readInput(`day${day}.in`).map((entry) => Number(entry));

    console.time('solving');
    const result: number =
      solver[runProblemFunctionName as keyof Solver](input);
    console.timeEnd('solving');

    return result;
  }
}

class Solver {
  runProblem1Part1(input: number[]): number {
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

  runProblem1Part2(input: number[]): number {
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
}

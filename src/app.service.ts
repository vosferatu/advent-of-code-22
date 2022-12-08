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
    const result: any = solver[runProblemFunctionName as keyof Solver](input);
    console.timeEnd('solving');

    return result;
  }
}

class Solver {
  private readonly utils = new Utils();

  runProblem7Part2(inputString: string[]): number {
    let currDir: string = inputString[0].split(' ')[2];
    let directory: any = {};
    directory = { '/': { size: 0, subDirectories: {} } };
    const dirSizes: any = {};

    const updateDirSize = (directory: any, currDir: string) => {
      const currentDirSize =
        this.utils.objectGet(directory, `${currDir}.size`) ?? 0;
      let totalSubDirSize = 0;

      for (const key of Object.keys(
        this.utils.objectGet(directory, `${currDir}.subDirectories`),
      )) {
        totalSubDirSize += this.utils.objectGet(
          directory,
          `${currDir}.subDirectories.${key}.size`,
        );
      }
      const newSize = currentDirSize + totalSubDirSize;

      this.utils.objectSetValue(directory, `${currDir}.size`, newSize);
      dirSizes[currDir] = newSize;
    };

    const calculateDiskSize = (): number => {
      const str = inputString.reduce(
        (acc: string, val: string) => (acc += `${val} `),
        '',
      );
      let sum = 0;
      const numbers = (str.match(/\d+/g) ?? []).map(Number);
      for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
      }
      return sum;
    };

    for (let i = 2; i < inputString.length; i++) {
      const output: string[] = inputString[i].split(' ');

      if (output[0] == 'dir') {
        this.utils.objectSetValue(
          directory,
          `${currDir}.subDirectories.${output[1]}`,
          {
            size: 0,
            subDirectories: {},
          },
        );
        continue;
      }
      if (!isNaN(Number(output[0]))) {
        const currentDirSize =
          this.utils.objectGet(directory, `${currDir}.size`) ?? 0;
        const currentFileSize = Number(output[0]) ?? 0;
        this.utils.objectSetValue(
          directory,
          `${currDir}.size`,
          currentDirSize + currentFileSize,
        );
        updateDirSize(directory, currDir);
        continue;
      }
      if (inputString[i].startsWith('$ cd')) {
        if (output[2] == '..') {
          updateDirSize(directory, currDir);
          currDir = currDir.substring(0, currDir.lastIndexOf('.'));
          currDir = currDir.substring(0, currDir.lastIndexOf('.'));
        } else {
          currDir = currDir + `.subDirectories.${output[2]}`;
        }
        continue;
      }
    }

    const diskSize = 70000000;
    const updateSize = 30000000;
    const diskUsed = calculateDiskSize();
    const minSpaceToFree = updateSize - (diskSize - Number(diskUsed));

    for (const size of Object.values(dirSizes).sort(
      (a: any, b: any) => a - b,
    )) {
      if (Number(size) >= minSpaceToFree) return Number(size);
    }

    return 0;
  }

  runProblem7Part1(inputString: string[]): number {
    let total = 0;
    let currDir: string = inputString[0].split(' ')[2];
    let directory: any = {};
    directory = { '/': { size: 0, subDirectories: {} } };

    const updateDirSize = (directory: any, currDir: string) => {
      const currentDirSize =
        this.utils.objectGet(directory, `${currDir}.size`) ?? 0;
      let totalSubDirSize = 0;

      for (const key of Object.keys(
        this.utils.objectGet(directory, `${currDir}.subDirectories`),
      )) {
        totalSubDirSize += this.utils.objectGet(
          directory,
          `${currDir}.subDirectories.${key}.size`,
        );
      }
      const newSize = currentDirSize + totalSubDirSize;

      this.utils.objectSetValue(directory, `${currDir}.size`, newSize);

      if (newSize <= 100000) total += newSize;
    };

    for (let i = 2; i < inputString.length; i++) {
      const output: string[] = inputString[i].split(' ');

      if (output[0] == 'dir') {
        this.utils.objectSetValue(
          directory,
          `${currDir}.subDirectories.${output[1]}`,
          {
            size: 0,
            subDirectories: {},
          },
        );
        continue;
      }
      if (!isNaN(Number(output[0]))) {
        const currentDirSize =
          this.utils.objectGet(directory, `${currDir}.size`) ?? 0;
        const currentFileSize = Number(output[0]) ?? 0;
        this.utils.objectSetValue(
          directory,
          `${currDir}.size`,
          currentDirSize + currentFileSize,
        );
        continue;
      }
      if (inputString[i].startsWith('$ cd')) {
        if (output[2] == '..') {
          updateDirSize(directory, currDir);
          currDir = currDir.substring(0, currDir.lastIndexOf('.'));
          currDir = currDir.substring(0, currDir.lastIndexOf('.'));
        } else {
          currDir = currDir + `.subDirectories.${output[2]}`;
        }
        continue;
      }
    }

    return total;
  }

  runProblem6Part2(inputString: string[]): number {
    const input = inputString?.[0];

    for (let i = 0; i < input.length - 14; i++) {
      const marker = input.substring(i, i + 14);
      let potentialMarker: any = marker.split('');
      potentialMarker = new Set(potentialMarker);
      potentialMarker = [...potentialMarker].join('');

      if (potentialMarker == marker) return i + 14;
    }
    return 0;
  }

  runProblem6Part1(inputString: string[]): number {
    const input = inputString?.[0];

    for (let i = 0; i < input.length - 4; i++) {
      const marker = input.substring(i, i + 4);
      let potentialMarker: any = marker.split('');
      potentialMarker = new Set(potentialMarker);
      potentialMarker = [...potentialMarker].join('');

      if (potentialMarker == marker) return i + 4;
    }
    return 0;
  }

  runProblem5Part2(inputString: string[]): string {
    let crates: any[] = [];

    let moves = false;
    for (const line of inputString) {
      if (line == '') {
        moves = true;
        continue;
      }

      if (line == '' || line.startsWith(' 1')) {
        crates = crates.map((crate) => crate.replace(/\W/g, ''));
        crates = crates.map((crate) => crate.split(''));
        continue;
      }

      if (moves) {
        const spaces: string[] = line.split(/\s+/);
        const [move, from, to] = spaces
          .map((entry) => Number(entry))
          .filter((entry) => !isNaN(entry));

        const moved = crates[from - 1].splice(0, move);
        crates[to - 1].unshift(...moved);
      } else {
        for (let i = 0, j = 1; j < line.length; i++, j += 4) {
          if (crates?.[i]) {
            crates[i] = crates[i].concat(line[j]);
          } else {
            crates[i] = line[j];
          }
        }
      }
    }

    return crates.reduce((acc, curr) => acc + curr?.[0] ?? '', '');
  }

  runProblem5Part1(inputString: string[]): string {
    let crates: any[] = [];

    let moves = false;
    for (const line of inputString) {
      if (line == '') {
        moves = true;
        continue;
      }

      if (line == '' || line.startsWith(' 1')) {
        crates = crates.map((crate) => crate.replace(/\W/g, ''));
        crates = crates.map((crate) => crate.split('').reverse());
        continue;
      }

      if (moves) {
        const spaces: string[] = line.split(/\s+/);
        const [move, from, to] = spaces
          .map((entry) => Number(entry))
          .filter((entry) => !isNaN(entry));

        for (let i = move; i > 0; i--) {
          const moved = crates[from - 1].pop();
          crates[to - 1].push(moved);
        }
      } else {
        for (let i = 0, j = 1; j < line.length; i++, j += 4) {
          if (crates?.[i]) {
            crates[i] = crates[i].concat(line[j]);
          } else {
            crates[i] = line[j];
          }
        }
      }
    }

    return crates.reduce(
      (acc, curr) => acc + curr?.[curr.length - 1] ?? '',
      '',
    );
  }

  runProblem4Part2(inputString: string[]): number {
    let total = 0;

    const checkOverlap = (pair: string[]): boolean => {
      const pair0 = pair[0].split('-').map((section) => Number(section));
      const pair1 = pair[1].split('-').map((section) => Number(section));

      if (pair0[0] >= pair1[0] && pair0[0] <= pair1[1]) return true;
      if (pair0[1] >= pair1[0] && pair0[1] <= pair1[1]) return true;

      if (pair1[0] >= pair0[0] && pair1[0] <= pair0[1]) return true;
      if (pair1[1] >= pair0[1] && pair1[1] <= pair0[1]) return true;

      return false;
    };

    for (const line of inputString) {
      const pair: string[] = line.split(',');

      if (checkOverlap(pair)) total += 1;
    }

    return total;
  }

  runProblem4Part1(inputString: string[]): number {
    let total = 0;

    const checkOverlap = (pair: string[]): boolean => {
      const pair0 = pair[0].split('-').map((section) => Number(section));
      const pair1 = pair[1].split('-').map((section) => Number(section));

      if (
        pair0[0] >= pair1[0] &&
        pair0[0] <= pair1[1] &&
        pair0[1] >= pair1[0] &&
        pair0[1] <= pair1[1]
      )
        return true;

      if (
        pair1[0] >= pair0[0] &&
        pair1[0] <= pair0[1] &&
        pair1[1] >= pair0[0] &&
        pair1[1] <= pair0[1]
      )
        return true;

      return false;
    };

    for (const line of inputString) {
      const pair: string[] = line.split(',');

      if (checkOverlap(pair)) total += 1;
    }

    return total;
  }

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

class Utils {
  objectSetValue(object: any, path: any, value: any) {
    const way = path.replace(/\[/g, '.').replace(/\]/g, '').split('.'),
      last = way.pop();
    way.reduce(function (o: any, k: any, i: any, kk: any) {
      return (o[k] =
        o[k] || (isFinite(i + 1 in kk ? kk[i + 1] : last) ? [] : {}));
    }, object)[last] = value;
  }

  objectGet = (t: any, path: string) =>
    path.split('.').reduce((r, k) => r?.[k], t);
}

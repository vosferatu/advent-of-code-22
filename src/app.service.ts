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

  runProblem17Part2(inputString: string[]) {
    const jetPattern = inputString[0];

    class Coordinate {
      add(x: number, y: number) {
        this.x += x;
        this.y += y;
      }

      copy(): Coordinate {
        return new Coordinate(this.x, this.y);
      }

      constructor(public x: number, public y: number) {}
    }
    class Shape {
      copy(): Shape {
        return new Shape(this.coordinates.map((x) => x.copy()));
      }
      constructor(public coordinates: Coordinate[]) {}
    }

    const shapes: Shape[] = [
      new Shape([
        new Coordinate(0, 0),
        new Coordinate(1, 0),
        new Coordinate(2, 0),
        new Coordinate(3, 0),
      ]),
      new Shape([
        new Coordinate(1, 2),
        new Coordinate(0, 1),
        new Coordinate(1, 1),
        new Coordinate(2, 1),
        new Coordinate(1, 0),
      ]),
      new Shape([
        new Coordinate(2, 2),
        new Coordinate(2, 1),
        new Coordinate(2, 0),
        new Coordinate(1, 0),
        new Coordinate(0, 0),
      ]),
      new Shape([
        new Coordinate(0, 0),
        new Coordinate(0, 1),
        new Coordinate(0, 2),
        new Coordinate(0, 3),
      ]),
      new Shape([
        new Coordinate(0, 0),
        new Coordinate(1, 0),
        new Coordinate(0, 1),
        new Coordinate(1, 1),
      ]),
    ];

    const chamberWidth = 7;
    const resting = new Set<string>();
    const getHeight = (world: Set<string>) =>
      [...world]
        .map((coord) => parseInt(coord.split(',')[1]))
        .reduce((max, height) => Math.max(max, height), -1);

    const collisions = (rock: Shape, moveX: number, moveY: number): boolean => {
      rock.coordinates = rock.coordinates.map(
        (x) => new Coordinate(x.x + moveX, x.y + moveY),
      );

      return rock.coordinates.some((c) => {
        if (resting.has(`${c.x},${c.y}`)) return true;
      });
    };

    const rockFall = (pattern: string, numberOfRocks: number): number => {
      let rockNumber = 0;
      let patternMove = 0;
      let addedHeight = 0;
      const previousStates: any = {};

      while (rockNumber < numberOfRocks) {
        let atRest = false;
        const nextRock = shapes[rockNumber % shapes.length].copy();

        const highestY = getHeight(resting);

        nextRock.coordinates.forEach((coordinate) =>
          coordinate.add(2, 3 + (highestY < 0 ? 0 : highestY + 1)),
        );

        while (!atRest) {
          const nextJet = pattern[patternMove] == '<' ? -1 : 1;
          patternMove++;
          if (patternMove > pattern.length - 1) patternMove = 0;

          const shapeXmax = Math.max(...nextRock.coordinates.map((x) => x.x));
          const shapeXmin = Math.min(...nextRock.coordinates.map((x) => x.x));
          const shapeY = Math.max(...nextRock.coordinates.map((x) => x.y));

          if (
            shapeXmin + nextJet >= 0 &&
            shapeXmax + nextJet < chamberWidth &&
            !collisions(nextRock.copy(), nextJet, 0)
          ) {
            nextRock.coordinates.forEach((coordinate) =>
              coordinate.add(nextJet, 0),
            );
          }

          if (shapeY - 1 >= 0 && !collisions(nextRock.copy(), 0, -1)) {
            nextRock.coordinates.forEach((coordinate) => coordinate.add(0, -1));
            continue;
          }

          atRest = true;

          for (const { x, y } of nextRock.coordinates) {
            resting.add(`${x},${y}`);
          }
        }

        // check if we have been here before
        const highest = (highestY < 0 ? 0 : highestY) + 1;
        let state = `${patternMove},${rockNumber % shapes.length},`;
        for (let y = highest; y >= highest - 10; y--) {
          let rownum = '';
          for (let x = 0; x < chamberWidth; x++)
            rownum += resting.has(`${x},${y}`) ? 1 : 0;
          state += parseInt(rownum, 2) + ',';
        }

        if (previousStates[state] != null) {
          const pieceCountChange =
            rockNumber - previousStates[state].rockNumber;
          const heightChange = highest - previousStates[state].height;

          const cycleAmount =
            Math.floor(
              (numberOfRocks - previousStates[state].rockNumber) /
                pieceCountChange,
            ) - 1;
          addedHeight += cycleAmount * heightChange;
          rockNumber += cycleAmount * pieceCountChange;
        } else previousStates[state] = { height: highest, rockNumber };
        rockNumber++;
      }

      return 1 + addedHeight + getHeight(resting);
    };

    return rockFall(jetPattern, 1000000000000);
  }

  runProblem17Part1(inputString: string[]) {
    const jetPattern = inputString[0];

    class Coordinate {
      add(x: number, y: number) {
        this.x += x;
        this.y += y;
      }

      copy(): Coordinate {
        return new Coordinate(this.x, this.y);
      }

      constructor(public x: number, public y: number) {}
    }
    class Shape {
      copy(): Shape {
        return new Shape(this.coordinates.map((x) => x.copy()));
      }
      constructor(public coordinates: Coordinate[]) {}
    }

    const shapes: Shape[] = [
      new Shape([
        new Coordinate(0, 0),
        new Coordinate(1, 0),
        new Coordinate(2, 0),
        new Coordinate(3, 0),
      ]),
      new Shape([
        new Coordinate(1, 2),
        new Coordinate(0, 1),
        new Coordinate(1, 1),
        new Coordinate(2, 1),
        new Coordinate(1, 0),
      ]),
      new Shape([
        new Coordinate(2, 2),
        new Coordinate(2, 1),
        new Coordinate(2, 0),
        new Coordinate(1, 0),
        new Coordinate(0, 0),
      ]),
      new Shape([
        new Coordinate(0, 0),
        new Coordinate(0, 1),
        new Coordinate(0, 2),
        new Coordinate(0, 3),
      ]),
      new Shape([
        new Coordinate(0, 0),
        new Coordinate(1, 0),
        new Coordinate(0, 1),
        new Coordinate(1, 1),
      ]),
    ];

    const chamberWidth = 7;
    const resting: Shape[] = [];

    const collisions = (rock: Shape, moveX: number, moveY: number): boolean => {
      rock.coordinates = rock.coordinates.map(
        (x) => new Coordinate(x.x + moveX, x.y + moveY),
      );

      return resting.some((shape) => {
        for (const { x, y } of shape.coordinates) {
          for (const c of rock.coordinates) {
            if (x == c.x && y == c.y) return true;
          }
        }
      });
    };

    const rockFall = (pattern: string, numberOfRocks: number): number => {
      let rockNumber = 0;
      let patternMove = 0;
      while (rockNumber < numberOfRocks) {
        let atRest = false;
        const nextRock = shapes[rockNumber % shapes.length].copy();

        const highestY = Math.max(
          ...resting.flatMap((x) => x.coordinates.map((x) => x.y)),
        );

        nextRock.coordinates.forEach((coordinate) =>
          coordinate.add(2, 3 + (highestY < 0 ? 0 : highestY + 1)),
        );

        while (!atRest) {
          const nextJet = pattern[patternMove] == '<' ? -1 : 1;
          patternMove++;
          if (patternMove > pattern.length - 1) patternMove = 0;

          const shapeXmax = Math.max(...nextRock.coordinates.map((x) => x.x));
          const shapeXmin = Math.min(...nextRock.coordinates.map((x) => x.x));
          const shapeY = Math.max(...nextRock.coordinates.map((x) => x.y));

          if (
            shapeXmin + nextJet >= 0 &&
            shapeXmax + nextJet < chamberWidth &&
            !collisions(nextRock.copy(), nextJet, 0)
          ) {
            nextRock.coordinates.forEach((coordinate) =>
              coordinate.add(nextJet, 0),
            );
          }

          if (shapeY - 1 >= 0 && !collisions(nextRock.copy(), 0, -1)) {
            nextRock.coordinates.forEach((coordinate) => coordinate.add(0, -1));
            continue;
          }

          atRest = true;
          resting.unshift(nextRock.copy());
        }
        rockNumber++;
      }
      return (
        Math.max(...resting.flatMap((x) => x.coordinates.map((x) => x.y))) + 1
      );
    };

    return rockFall(jetPattern, 2022);
  }

  runProblem16Part2(inputString: string[]) {
    class Valve {
      public open = false;
      public flows = true;

      constructor(
        public name: string,
        public rate: number,
        public tunnels: string[],
      ) {
        if (rate <= 0) this.flows = false;
      }
    }

    const valves: Record<string, Valve> = {};
    const shortestPaths: Record<string, number> = {};
    const nodesWithFlow = new Array<string>();
    const flowNodeIndexes: Record<string, number> = {};

    for (let i = 0; i < inputString.length; i++) {
      const [valveInfo, tunnels] = inputString[i].split(';');
      const [valveName] = valveInfo.substring(1).match(/([A-Z][A-Z]+)/g) ?? [
        '',
      ];
      const valveRate = Number(valveInfo.substring(valveInfo.indexOf('=') + 1));
      const valveTunnels = tunnels.match(/([A-Z][A-Z]+)/g) ?? [];
      const newValve = new Valve(valveName ?? '', valveRate, valveTunnels);

      shortestPaths[`${valveName}:${valveName}`] = 0;
      for (const to of valveTunnels) {
        shortestPaths[`${valveName}:${to}`] = 1;
      }

      if (valveRate > 0) {
        nodesWithFlow.push(valveName);
        flowNodeIndexes[valveName] = nodesWithFlow.length;
      }

      valves[valveName] = newValve;
    }

    for (const currNode of Object.keys(valves)) {
      for (const leftNode of Object.keys(valves)) {
        for (const rightNode of Object.keys(valves)) {
          shortestPaths[`${leftNode}:${rightNode}`] = Math.min(
            shortestPaths[`${leftNode}:${rightNode}`] ?? 1e6,
            (shortestPaths[`${leftNode}:${currNode}`] ?? 1e6) +
              (shortestPaths[`${currNode}:${rightNode}`] ?? 1e6),
          );
        }
      }
    }

    function addOpen(current: number, node: string): number {
      const openValve = 1 << flowNodeIndexes[node];
      return current | openValve;
    }

    function isOpen(current: number, node: string): boolean {
      const openValve = 1 << flowNodeIndexes[node];

      const isOpenNum = current & openValve;
      return isOpenNum > 0;
    }

    type Item = {
      openValves: number;
      timeLeft: number;
      currentValve: string;
      totalFlow: number;
    };

    const graphSearch = (totalTime: number, onVisit: (item: Item) => void) => {
      const pathScore: Array<Item> = [];
      pathScore.push({
        currentValve: 'AA',
        timeLeft: totalTime,
        openValves: 0,
        totalFlow: 0,
      });
      const visited = new Set<string>();
      while (pathScore.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = pathScore.pop()!;
        const { openValves, timeLeft, currentValve, totalFlow } = item;
        const visitedKey = `${currentValve}:${timeLeft}:${openValves}:${totalFlow}`;
        if (visited.has(visitedKey)) continue;
        visited.add(visitedKey);

        onVisit(item);

        if (timeLeft === 0) {
          continue;
        }

        for (const next of nodesWithFlow) {
          if (isOpen(openValves, next)) continue;
          const nextRemaining =
            timeLeft - shortestPaths[`${currentValve}:${next}`] - 1;
          if (nextRemaining <= 0) continue;
          pathScore.push({
            currentValve: next,
            openValves: addOpen(openValves, next),
            timeLeft: nextRemaining,
            totalFlow: totalFlow + nextRemaining * valves[next].rate,
          });
        }
      }
    };

    let pressure = 0;

    const status26 = new Map<number, number>();
    graphSearch(26, (item) => {
      status26.set(
        item.openValves,
        Math.max(status26.get(item.openValves) ?? 0, item.totalFlow),
      );
    });

    for (const [openValves1, totalFlow1] of status26) {
      for (const [openValves2, totalFlow2] of status26) {
        const overlap = openValves1 & openValves2;
        if (overlap !== 0) continue;
        pressure = Math.max(pressure, totalFlow1 + totalFlow2);
      }
    }

    return pressure;
  }

  runProblem16Part1(inputString: string[]) {
    class Valve {
      public open = false;
      public flows = true;

      constructor(
        public name: string,
        public rate: number,
        public tunnels: string[],
      ) {
        if (rate <= 0) this.flows = false;
      }
    }

    const valves: Record<string, Valve> = {};
    const shortestPaths: Record<string, number> = {};
    const nodesWithFlow = new Array<string>();
    const flowNodeIndexes: Record<string, number> = {};

    for (let i = 0; i < inputString.length; i++) {
      const [valveInfo, tunnels] = inputString[i].split(';');
      const [valveName] = valveInfo.substring(1).match(/([A-Z][A-Z]+)/g) ?? [
        '',
      ];
      const valveRate = Number(valveInfo.substring(valveInfo.indexOf('=') + 1));
      const valveTunnels = tunnels.match(/([A-Z][A-Z]+)/g) ?? [];
      const newValve = new Valve(valveName ?? '', valveRate, valveTunnels);

      shortestPaths[`${valveName}:${valveName}`] = 0;
      for (const to of valveTunnels) {
        shortestPaths[`${valveName}:${to}`] = 1;
      }

      if (valveRate > 0) {
        nodesWithFlow.push(valveName);
        flowNodeIndexes[valveName] = nodesWithFlow.length;
      }

      valves[valveName] = newValve;
    }

    for (const currNode of Object.keys(valves)) {
      for (const leftNode of Object.keys(valves)) {
        for (const rightNode of Object.keys(valves)) {
          shortestPaths[`${leftNode}:${rightNode}`] = Math.min(
            shortestPaths[`${leftNode}:${rightNode}`] ?? 1e6,
            (shortestPaths[`${leftNode}:${currNode}`] ?? 1e6) +
              (shortestPaths[`${currNode}:${rightNode}`] ?? 1e6),
          );
        }
      }
    }

    function addOpen(current: number, node: string): number {
      const openValve = 1 << flowNodeIndexes[node];
      return current | openValve;
    }

    function isOpen(current: number, node: string): boolean {
      const openValve = 1 << flowNodeIndexes[node];

      const isOpenNum = current & openValve;
      return isOpenNum > 0;
    }

    type Item = {
      openValves: number;
      timeLeft: number;
      currentValve: string;
      totalFlow: number;
    };

    const graphSearch = (totalTime: number, onVisit: (item: Item) => void) => {
      const pathScore: Array<Item> = [];
      pathScore.push({
        currentValve: 'AA',
        timeLeft: totalTime,
        openValves: 0,
        totalFlow: 0,
      });
      const visited = new Set<string>();
      while (pathScore.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = pathScore.pop()!;
        const { openValves, timeLeft, currentValve, totalFlow } = item;
        const visitedKey = `${currentValve}:${timeLeft}:${openValves}:${totalFlow}`;
        if (visited.has(visitedKey)) continue;
        visited.add(visitedKey);

        onVisit(item);

        if (timeLeft === 0) {
          continue;
        }

        for (const next of nodesWithFlow) {
          if (isOpen(openValves, next)) continue;
          const nextRemaining =
            timeLeft - shortestPaths[`${currentValve}:${next}`] - 1;
          if (nextRemaining <= 0) continue;
          pathScore.push({
            currentValve: next,
            openValves: addOpen(openValves, next),
            timeLeft: nextRemaining,
            totalFlow: totalFlow + nextRemaining * valves[next].rate,
          });
        }
      }
    };

    let pressure = 0;

    graphSearch(30, (item) => {
      pressure = Math.max(item.totalFlow, pressure);
    });

    return pressure;
  }

  runProblem15Part2(inputString: string[]) {
    class Coordinate {
      constructor(public x: number, public y: number) {}

      inBound(bound: number): boolean {
        return this.x > 0 && this.x < bound && this.y > 0 && this.y < bound;
      }
    }

    class Pair {
      constructor(public sensor: Coordinate, public beacon: Coordinate) {}
    }

    const manhattanDistance = (a: Coordinate, b: Coordinate) => {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };

    const bound = 4_000_000; // 20; // for demo
    const pairs: Pair[] = [];

    for (let i = 0; i < inputString.length; i++) {
      const [sensor, beacon] = inputString[i].split(':');
      const sensorX = sensor.substring(
        sensor.indexOf('x=') + 2,
        sensor.indexOf(','),
      );
      const sensorY = sensor.substring(sensor.indexOf('y=') + 2);
      const beaconX = beacon.substring(
        beacon.indexOf('x=') + 2,
        beacon.indexOf(','),
      );
      const beaconY = beacon.substring(beacon.indexOf('y=') + 2);

      const pair = new Pair(
        new Coordinate(Number(sensorX), Number(sensorY)),
        new Coordinate(Number(beaconX), Number(beaconY)),
      );

      pairs.push(pair);
    }

    const radius = pairs.map((pair) =>
      manhattanDistance(pair.sensor, pair.beacon),
    );
    // y = m*x + b, m -> gradient
    const gradientLinesPositive: number[] = [];
    const gradientLinesNegative: number[] = [];

    for (let i = 0; i < radius.length; i++) {
      gradientLinesPositive.push(
        pairs[i].sensor.y - pairs[i].sensor.x + radius[i] + 1,
      );
      gradientLinesPositive.push(
        pairs[i].sensor.y - pairs[i].sensor.x - radius[i] - 1,
      );
      gradientLinesNegative.push(
        pairs[i].sensor.x + pairs[i].sensor.y + radius[i] + 1,
      );
      gradientLinesNegative.push(
        pairs[i].sensor.x + pairs[i].sensor.y - radius[i] - 1,
      );
    }

    for (const positiveGradient of gradientLinesPositive) {
      for (const negativeGradient of gradientLinesNegative) {
        const intersection = new Coordinate(
          Math.floor((negativeGradient - positiveGradient) / 2),
          Math.floor((negativeGradient + positiveGradient) / 2),
        );

        if (intersection.inBound(bound)) {
          if (
            pairs.every(
              (pair) =>
                manhattanDistance(intersection, pair.sensor) >
                manhattanDistance(pair.sensor, pair.beacon),
            )
          )
            return 4_000_000 * intersection.x + intersection.y;
        }
      }
    }

    return 0;
  }

  runProblem15Part1(inputString: string[]) {
    class Coordinate {
      constructor(public x: number, public y: number) {}
    }

    class Pair {
      constructor(public sensor: Coordinate, public beacon: Coordinate) {}
    }

    const specifiedRow = 2_000_000;
    const pairs: Pair[] = [];
    const signals: Set<number> = new Set();

    for (let i = 0; i < inputString.length; i++) {
      const [sensor, beacon] = inputString[i].split(':');
      const sensorX = sensor.substring(
        sensor.indexOf('x=') + 2,
        sensor.indexOf(','),
      );
      const sensorY = sensor.substring(sensor.indexOf('y=') + 2);
      const beaconX = beacon.substring(
        beacon.indexOf('x=') + 2,
        beacon.indexOf(','),
      );
      const beaconY = beacon.substring(beacon.indexOf('y=') + 2);

      const pair = new Pair(
        new Coordinate(Number(sensorX), Number(sensorY)),
        new Coordinate(Number(beaconX), Number(beaconY)),
      );

      pairs.push(pair);
    }

    for (const { sensor, beacon } of pairs) {
      const manhattanDistance =
        Math.abs(beacon.x - sensor.x) + Math.abs(beacon.y - sensor.y);

      if (
        specifiedRow > manhattanDistance + sensor.y &&
        specifiedRow < sensor.y - manhattanDistance
      )
        continue;

      const rownManhattanDistance =
        specifiedRow > sensor.y
          ? sensor.y + manhattanDistance - specifiedRow
          : specifiedRow - (sensor.y - manhattanDistance);

      for (
        let x = sensor.x - rownManhattanDistance;
        x < sensor.x + rownManhattanDistance;
        x++
      )
        signals.add(x);
    }

    return signals.size;
  }

  runProblem14Part2(inputString: string[]): number {
    class Coordinate {
      constructor(public x: number, public y: number) {}
    }

    const coordinates: Coordinate[][] = [];
    let largestX = 0;
    let smallestX = Infinity;
    let largestY = 0;
    let smallestY = Infinity;

    for (let i = 0; i < inputString.length; i++) {
      const lineCoordinates = inputString[i]
        .split(' -> ')
        .map((str) => str.split(','))
        .map((pair) => new Coordinate(Number(pair[0]), Number(pair[1])));

      coordinates.push(lineCoordinates);

      largestX = Math.max(largestX, ...lineCoordinates.map((x) => x.x));
      smallestX = Math.min(smallestX, ...lineCoordinates.map((x) => x.x));
      largestY = Math.max(largestY, ...lineCoordinates.map((x) => x.y));
      smallestY = Math.min(smallestY, ...lineCoordinates.map((x) => x.y));
    }

    const grid: string[][] = new Array<string[]>(largestY + 3);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array<string>(2 * largestX).fill('.');
    }

    coordinates.push([
      new Coordinate(0, largestY + 2),
      new Coordinate(2 * largestX, largestY + 2),
    ]);

    for (let i = 0; i < coordinates.length; i++) {
      for (let j = 0; j < coordinates[i].length - 1; j++) {
        if (coordinates[i][j].x === coordinates[i][j + 1].x) {
          const ys = Array.from(
            new Array(
              Math.abs(coordinates[i][j + 1].y - coordinates[i][j].y) + 1,
            ),
            (x, k) =>
              k +
              (coordinates[i][j].y > coordinates[i][j + 1].y
                ? coordinates[i][j + 1].y
                : coordinates[i][j].y),
          );

          ys.forEach((y: number) => (grid[y][coordinates[i][j].x] = '#'));
          continue;
        }

        if (coordinates[i][j].y === coordinates[i][j + 1].y) {
          const xs = Array.from(
            new Array(
              Math.abs(coordinates[i][j + 1].x - coordinates[i][j].x) + 1,
            ),
            (x, k) =>
              k +
              (coordinates[i][j].x > coordinates[i][j + 1].x
                ? coordinates[i][j + 1].x
                : coordinates[i][j].x),
          );

          xs.forEach((x: number) => (grid[coordinates[i][j].y][x] = '#'));
        }
      }
    }

    const sandDrip = new Coordinate(500, 0);
    grid[sandDrip.y][sandDrip.x] = '+';
    let atRest = 0;
    let voidFlow = false;
    const movingSand = new Coordinate(sandDrip.x, sandDrip.y + 1);

    while (!voidFlow) {
      if (
        grid?.[movingSand.y + 1]?.[movingSand.x] &&
        grid?.[movingSand.y + 1]?.[movingSand.x] == '.'
      ) {
        movingSand.x = movingSand.x;
        movingSand.y = movingSand.y + 1;
        continue;
      } else if (
        grid?.[movingSand.y + 1]?.[movingSand.x - 1] &&
        grid?.[movingSand.y + 1]?.[movingSand.x - 1] == '.'
      ) {
        movingSand.x = movingSand.x - 1;
        movingSand.y = movingSand.y + 1;
        continue;
      } else if (
        grid?.[movingSand.y + 1]?.[movingSand.x + 1] &&
        grid?.[movingSand.y + 1]?.[movingSand.x + 1] == '.'
      ) {
        movingSand.x = movingSand.x + 1;
        movingSand.y = movingSand.y + 1;
        continue;
      }

      if (
        !grid?.[movingSand.y + 1]?.[movingSand.x + 1] ||
        !grid?.[movingSand.y + 1]?.[movingSand.x - 1] ||
        !grid?.[movingSand.y]?.[movingSand.x + 1]
      ) {
        voidFlow = true;
        continue;
      }

      if (movingSand.x === sandDrip.x && movingSand.y === sandDrip.y) {
        voidFlow = true;
        atRest++;
        continue;
      }

      grid[movingSand.y][movingSand.x] = 'o';

      atRest++;
      movingSand.x = sandDrip.x;
      movingSand.y = sandDrip.y;
    }

    return atRest;
  }

  runProblem14Part1(inputString: string[]): number {
    class Coordinate {
      constructor(public x: number, public y: number) {}
    }

    let coordinates: Coordinate[][] = [];
    let largestX = 0;
    let smallestX = Infinity;
    let largestY = 0;
    let smallestY = Infinity;

    for (let i = 0; i < inputString.length; i++) {
      const lineCoordinates = inputString[i]
        .split(' -> ')
        .map((str) => str.split(','))
        .map((pair) => new Coordinate(Number(pair[0]), Number(pair[1])));

      coordinates.push(lineCoordinates);

      largestX = Math.max(largestX, ...lineCoordinates.map((x) => x.x));
      smallestX = Math.min(smallestX, ...lineCoordinates.map((x) => x.x));
      largestY = Math.max(largestY, ...lineCoordinates.map((x) => x.y));
      smallestY = Math.min(smallestY, ...lineCoordinates.map((x) => x.y));
    }

    coordinates = coordinates.map((outer) =>
      outer.map((x) => new Coordinate(x.x - smallestX, x.y)),
    );

    const sandDrip = new Coordinate(500 - smallestX, 0);

    const grid: string[][] = new Array<string[]>(largestX - smallestX + 1);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array<string>(largestY + 1).fill('.');
    }

    for (let i = 0; i < coordinates.length; i++) {
      for (let j = 0; j < coordinates[i].length - 1; j++) {
        if (coordinates[i][j].x === coordinates[i][j + 1].x) {
          const ys = Array.from(
            new Array(
              Math.abs(coordinates[i][j + 1].y - coordinates[i][j].y) + 1,
            ),
            (x, k) =>
              k +
              (coordinates[i][j].y > coordinates[i][j + 1].y
                ? coordinates[i][j + 1].y
                : coordinates[i][j].y),
          );

          ys.forEach((y: number) => (grid[coordinates[i][j].x][y] = '#'));
          continue;
        }

        if (coordinates[i][j].y === coordinates[i][j + 1].y) {
          const xs = Array.from(
            new Array(
              Math.abs(coordinates[i][j + 1].x - coordinates[i][j].x) + 1,
            ),
            (x, k) =>
              k +
              (coordinates[i][j].x > coordinates[i][j + 1].x
                ? coordinates[i][j + 1].x
                : coordinates[i][j].x),
          );

          xs.forEach((x: number) => (grid[x][coordinates[i][j].y] = '#'));
        }
      }
    }

    grid[sandDrip.x][sandDrip.y] = '+';
    let atRest = 0;
    let voidFlow = false;
    const movingSand = new Coordinate(sandDrip.x, sandDrip.y + 1);

    while (!voidFlow) {
      if (
        grid?.[movingSand.x]?.[movingSand.y + 1] &&
        grid?.[movingSand.x]?.[movingSand.y + 1] == '.'
      ) {
        movingSand.x = movingSand.x;
        movingSand.y = movingSand.y + 1;
        continue;
      } else if (
        grid?.[movingSand.x - 1]?.[movingSand.y + 1] &&
        grid?.[movingSand.x - 1]?.[movingSand.y + 1] == '.'
      ) {
        movingSand.x = movingSand.x - 1;
        movingSand.y = movingSand.y + 1;
        continue;
      } else if (
        grid?.[movingSand.x + 1]?.[movingSand.y + 1] &&
        grid?.[movingSand.x + 1]?.[movingSand.y + 1] == '.'
      ) {
        movingSand.x = movingSand.x + 1;
        movingSand.y = movingSand.y + 1;
        continue;
      }

      if (
        !grid?.[movingSand.x + 1]?.[movingSand.y + 1] ||
        !grid?.[movingSand.x - 1]?.[movingSand.y + 1] ||
        !grid?.[movingSand.x]?.[movingSand.y + 1]
      ) {
        voidFlow = true;
        continue;
      }

      if (movingSand.x === sandDrip.x && movingSand.y === sandDrip.y) {
        voidFlow = true;
        continue;
      }

      grid[movingSand.x][movingSand.y] = 'o';

      atRest++;
      movingSand.x = sandDrip.x;
      movingSand.y = sandDrip.y;
    }

    return atRest;
  }

  runProblem13Part2(inputString: string[]): number {
    const input = inputString.filter((str) => str.length);
    input.push('[[6]]', '[[2]]');

    const isNumber = (x: any): boolean => {
      return !Array.isArray(x) && !isNaN(x);
    };

    const pairInOrder = (first: any, second: any): boolean | undefined => {
      while (first.length && second.length) {
        const left = first.shift();
        const right = second.shift();

        if (isNumber(left) && isNumber(right)) {
          if (left < right) return true;
          else if (left > right) return false;
        } else if (Array.isArray(left) && Array.isArray(right)) {
          const result = pairInOrder(left, right);
          if (typeof result == 'boolean') return result;
        } else if (isNumber(left) && Array.isArray(right)) {
          const result = pairInOrder([left], right);
          if (typeof result == 'boolean') return result;
        } else if (Array.isArray(left) && isNumber(right)) {
          const result = pairInOrder(left, [right]);
          if (typeof result == 'boolean') return result;
        }
      }

      if (first.length) return false;
      if (second.length) return true;

      return undefined;
    };

    input.sort((a, b) => (pairInOrder(eval(a), eval(b)) ? -1 : 1));

    return (
      (input.findIndex((x) => x == '[[6]]') + 1) *
      (input.findIndex((x) => x == '[[2]]') + 1)
    );
  }

  runProblem13Part1(inputString: string[]): number {
    const isNumber = (x: any): boolean => {
      return !Array.isArray(x) && !isNaN(x);
    };

    const pairInOrder = (first: any, second: any): boolean | undefined => {
      while (first.length && second.length) {
        const left = first.shift();
        const right = second.shift();

        if (isNumber(left) && isNumber(right)) {
          if (left < right) return true;
          else if (left > right) return false;
        } else if (Array.isArray(left) && Array.isArray(right)) {
          const result = pairInOrder(left, right);
          if (typeof result == 'boolean') return result;
        } else if (isNumber(left) && Array.isArray(right)) {
          const result = pairInOrder([left], right);
          if (typeof result == 'boolean') return result;
        } else if (Array.isArray(left) && isNumber(right)) {
          const result = pairInOrder(left, [right]);
          if (typeof result == 'boolean') return result;
        }
      }

      if (first.length) return false;
      if (second.length) return true;

      return undefined;
    };

    let numOrdered = 0;
    for (let i = 0; i < inputString.length; i += 3) {
      const pair1 = eval(inputString[i]);
      const pair2 = eval(inputString[i + 1]);

      if (pairInOrder(pair1, pair2)) numOrdered += i / 3 + 1;
    }

    return numOrdered;
  }

  runProblem12Part2(inputString: string[]): number {
    let end = { x: 0, y: 0 };

    const reverseInput: string[] = [];
    for (let i = 0; i < inputString[0].length; i++) {
      let columnString = '';
      for (let j = 0; j < inputString.length; j++) {
        columnString += inputString[j][i];
      }
      reverseInput.push(columnString);
    }

    const grid = reverseInput.map((str) => str.split(''));
    const startPositions: {
      x: number;
      y: number;
    }[] = [];

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == 'S') {
          startPositions.push({ x: i, y: j });
          grid[i][j] = 'a';
        }
        if (grid[i][j] == 'E') {
          end = { x: i, y: j };
          grid[i][j] = 'z';
        }
        if (grid[i][j] == 'a') {
          startPositions.push({ x: i, y: j });
        }
      }
    }

    const queue = [end];
    const visited = grid.map((x) => x.map(() => false));
    const paths = grid.map((x) => x.map(() => Infinity));
    paths[end.x][end.y] = 0;

    while (queue.length > 0) {
      const currentPosition = queue.shift() ?? end;
      visited[currentPosition.x][currentPosition.y] = true;

      let adjacents = [
        { x: currentPosition.x, y: currentPosition.y - 1 },
        { x: currentPosition.x, y: currentPosition.y + 1 },
        { x: currentPosition.x - 1, y: currentPosition.y },
        { x: currentPosition.x + 1, y: currentPosition.y },
      ];

      adjacents = adjacents.filter((adjacent) => {
        return grid[adjacent.x]?.[adjacent.y] !== undefined;
      });

      adjacents.forEach((adjacent) => {
        const currentHeight = grid[currentPosition.x][currentPosition.y];
        const nextHeight = grid[adjacent.x][adjacent.y];

        if (currentHeight.charCodeAt(0) >= nextHeight.charCodeAt(0) - 1) {
          const shortestDist = paths[adjacent.x][adjacent.y] + 1;
          const currShortestDist = paths[currentPosition.x][currentPosition.y];

          paths[currentPosition.x][currentPosition.y] = Math.min(
            currShortestDist,
            shortestDist,
          );
        }

        if (
          !visited[adjacent.x][adjacent.y] &&
          currentHeight.charCodeAt(0) <= nextHeight.charCodeAt(0) + 1
        ) {
          queue.push(adjacent);
          visited[adjacent.x][adjacent.y] = true;
        }
      });
    }

    return Math.min(...startPositions.map((start) => paths[start.x][start.y]));
  }

  runProblem12Part1(inputString: string[]): number {
    let end = { x: 0, y: 0 };
    let me = { x: 0, y: 0 };

    const reverseInput: string[] = [];
    for (let i = 0; i < inputString[0].length; i++) {
      let columnString = '';
      for (let j = 0; j < inputString.length; j++) {
        columnString += inputString[j][i];
      }
      reverseInput.push(columnString);
    }

    const grid = reverseInput.map((str) => str.split(''));

    let doneAnalyzing = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == 'S') {
          me = { x: i, y: j };
          grid[i][j] = 'a';
          doneAnalyzing++;
        }
        if (grid[i][j] == 'E') {
          end = { x: i, y: j };
          grid[i][j] = 'z';
          doneAnalyzing++;
        }
        if (doneAnalyzing == 2) break;
      }
    }

    const queue = [end];
    const visited = grid.map((x) => x.map(() => false));
    const paths = grid.map((x) => x.map(() => Infinity));
    paths[end.x][end.y] = 0;

    while (queue.length > 0) {
      const currentPosition = queue.shift() ?? end;
      visited[currentPosition.x][currentPosition.y] = true;

      let adjacents = [
        { x: currentPosition.x, y: currentPosition.y - 1 },
        { x: currentPosition.x, y: currentPosition.y + 1 },
        { x: currentPosition.x - 1, y: currentPosition.y },
        { x: currentPosition.x + 1, y: currentPosition.y },
      ];

      adjacents = adjacents.filter((adjacent) => {
        return grid[adjacent.x]?.[adjacent.y] !== undefined;
      });

      adjacents.forEach((adjacent) => {
        const currentHeight = grid[currentPosition.x][currentPosition.y];
        const nextHeight = grid[adjacent.x][adjacent.y];

        if (currentHeight.charCodeAt(0) >= nextHeight.charCodeAt(0) - 1) {
          const shortestDist = paths[adjacent.x][adjacent.y] + 1;
          const currShortestDist = paths[currentPosition.x][currentPosition.y];

          paths[currentPosition.x][currentPosition.y] = Math.min(
            currShortestDist,
            shortestDist,
          );
        }

        if (
          !visited[adjacent.x][adjacent.y] &&
          currentHeight.charCodeAt(0) <= nextHeight.charCodeAt(0) + 1
        ) {
          queue.push(adjacent);
          visited[adjacent.x][adjacent.y] = true;
        }
      });
    }

    return paths[me.x][me.y];
  }

  runProblem11Part2(inputString: string[]): number {
    class Monkey {
      items: number[];
      // eslint-disable-next-line @typescript-eslint/ban-types
      operation: Function;
      // eslint-disable-next-line @typescript-eslint/ban-types
      test: Function;
      numInspected = 0;

      // eslint-disable-next-line @typescript-eslint/ban-types
      constructor(items: number[], operation: Function, test: Function) {
        this.items = items;
        this.operation = operation;
        this.test = test;
      }
    }

    const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);

    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

    const moduloNumbers: number[] = [];
    const monkeys: Monkey[] = [];
    for (let i = 0; i < inputString.length; i += 7) {
      const startingItems = inputString[i + 1]
        .substring(inputString[i + 1].lastIndexOf(':') + 2)
        .split(', ')
        .map((x: string) => Number(x));

      const operators = inputString[i + 2]
        .substring(inputString[i + 2].lastIndexOf('=') + 2)
        .split(' ');

      let operation = (a: number) => a * 0;
      const operand = isNaN(Number(operators[2]));
      switch (operators[1]) {
        case '+':
          operation = function (a: number) {
            return a + (operand ? a : Number(operators[2]).valueOf());
          };
          break;
        case '*':
          operation = function (a: number) {
            return a * (operand ? a : Number(operators[2]).valueOf());
          };
          break;
        case '-':
          operation = function (a: number) {
            return a - (operand ? a : Number(operators[2]).valueOf());
          };
          break;
        case '/':
          operation = function (a: number) {
            return Math.floor(
              a / (operand ? a : Number(operators[2].valueOf())),
            );
          };
      }

      const testNumber = Number(inputString[i + 3].replace(/^\D+/g, ''));
      const returnTrue = Number(inputString[i + 4].replace(/^\D+/g, ''));
      const returnFalse = Number(inputString[i + 5].replace(/^\D+/g, ''));
      moduloNumbers.push(testNumber);

      monkeys.push(
        new Monkey(startingItems, operation, (a: number) => {
          if (a % testNumber == 0) return returnTrue.valueOf();

          return returnFalse.valueOf();
        }),
      );
    }

    const modulo = moduloNumbers.reduce(lcm);

    for (let j = 1; j < 10001; j++) {
      for (let i = 0; i < monkeys.length; i++) {
        while (monkeys[i].items.length > 0) {
          let itemToInspect = monkeys[i].items.shift() ?? 0;
          itemToInspect = monkeys[i].operation(itemToInspect);

          itemToInspect = itemToInspect % modulo;

          const monkeyToPassTo = monkeys[i].test(itemToInspect);

          monkeys[i].numInspected += 1;

          monkeys[monkeyToPassTo].items.push(itemToInspect);
        }
      }
    }

    monkeys.sort((a, b) => b.numInspected - a.numInspected);

    return monkeys[0].numInspected * monkeys[1].numInspected;
  }

  runProblem11Part1(inputString: string[]): number {
    class Monkey {
      items: number[];
      // eslint-disable-next-line @typescript-eslint/ban-types
      operation: Function;
      // eslint-disable-next-line @typescript-eslint/ban-types
      test: Function;
      numInspected = 0;

      // eslint-disable-next-line @typescript-eslint/ban-types
      constructor(items: number[], operation: Function, test: Function) {
        this.items = items;
        this.operation = operation;
        this.test = test;
      }
    }

    const monkeys: Monkey[] = [];
    for (let i = 0; i < inputString.length; i += 7) {
      const startingItems = inputString[i + 1]
        .substring(inputString[i + 1].lastIndexOf(':') + 2)
        .split(', ')
        .map((x: string) => Number(x));

      const operators = inputString[i + 2]
        .substring(inputString[i + 2].lastIndexOf('=') + 2)
        .split(' ');

      let operation = (a: number) => a * 0;
      const operand = isNaN(Number(operators[2]));
      switch (operators[1]) {
        case '+':
          operation = function (a: number) {
            return a + (operand ? a : Number(operators[2]).valueOf());
          };
          break;
        case '*':
          operation = function (a: number) {
            return a * (operand ? a : Number(operators[2]).valueOf());
          };
          break;
        case '-':
          operation = function (a: number) {
            return a - (operand ? a : Number(operators[2]).valueOf());
          };
          break;
        case '/':
          operation = function (a: number) {
            return Math.floor(
              a / (operand ? a : Number(operators[2].valueOf())),
            );
          };
      }

      const testNumber = Number(inputString[i + 3].replace(/^\D+/g, ''));
      const returnTrue = Number(inputString[i + 4].replace(/^\D+/g, ''));
      const returnFalse = Number(inputString[i + 5].replace(/^\D+/g, ''));

      monkeys.push(
        new Monkey(startingItems, operation, (a: number) => {
          if (a % testNumber == 0) return returnTrue.valueOf();

          return returnFalse.valueOf();
        }),
      );
    }

    for (let j = 0; j < 20; j++) {
      for (let i = 0; i < monkeys.length; i++) {
        while (monkeys[i].items.length > 0) {
          let itemToInspect = monkeys[i].items.shift() ?? 0;
          itemToInspect = monkeys[i].operation(itemToInspect);
          itemToInspect = Math.floor(itemToInspect / 3);

          const monkeyToPassTo = monkeys[i].test(itemToInspect);

          monkeys[i].numInspected += 1;

          monkeys[monkeyToPassTo].items.push(itemToInspect);
        }
      }
    }

    monkeys.sort((a, b) => b.numInspected - a.numInspected);

    return monkeys[0].numInspected * monkeys[1].numInspected;
  }

  runProblem10Part2(inputString: string[]): string {
    const instructions: { instruction: string; value: number }[] =
      inputString.map((entry) => {
        const [instruction, value] = entry.split(' ');
        return { instruction, value: Number(value) ?? 0 };
      });

    const makeArray = <T>(w: number, h: number, val: T) => {
      const arr: T[][] = [];
      for (let i = 0; i < h; i++) {
        arr[i] = [];
        for (let j = 0; j < w; j++) {
          arr[i][j] = val;
        }
      }
      return arr;
    };

    let registerX = 1;
    let clock = 0;
    const timestamps = [40, 80, 120, 160, 200, 240];
    const CRT: string[][] = makeArray(40, 6, '.');
    let j = 0;

    for (const { instruction, value } of instructions) {
      let currentOperationCycles = 0;

      switch (instruction) {
        case 'noop':
          currentOperationCycles = 1;
          break;
        case 'addx':
          currentOperationCycles = 2;
          break;
      }

      const positions = [registerX - 1, registerX, registerX + 1];
      for (let i = 0; i < currentOperationCycles; i++) {
        if (positions.includes(clock % 40)) CRT[j][clock % 40] = '#';

        clock += 1;
        if (timestamps.includes(clock)) j++;
      }

      if (currentOperationCycles == 2) registerX += value;
    }

    return CRT.reduce((acc, val) => (acc += val.join('') + '\n'), '');
  }

  runProblem10Part1(inputString: string[]): number {
    const instructions: { instruction: string; value: number }[] =
      inputString.map((entry) => {
        const [instruction, value] = entry.split(' ');
        return { instruction, value: Number(value) ?? 0 };
      });

    let registerX = 1;
    let clock = 0;
    const timestamps = [20, 60, 100, 140, 180, 220];
    let total = 0;

    for (const { instruction, value } of instructions) {
      let currentOperationCycles = 0;
      switch (instruction) {
        case 'noop':
          currentOperationCycles = 1;
          break;
        case 'addx':
          currentOperationCycles = 2;
          break;
      }

      for (let i = 0; i < currentOperationCycles; i++) {
        clock += 1;

        if (timestamps.includes(clock)) total += clock * registerX;
      }

      if (currentOperationCycles == 2) registerX += value;
    }
    return total;
  }

  runProblem9Part2(inputString: string[]): number {
    const headMovements: { direction: string; steps: number }[] =
      inputString.map((entry) => {
        const [direction, steps] = entry.split(' ');
        return { direction, steps: Number(steps) };
      });

    const tailPositions = Array(10)
      .fill(undefined)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map((u: any) => ({ x: 0, y: 0 }));
    const uniquePositions = new Set<string>();
    uniquePositions.add(`0,0`);

    for (const { direction, steps } of headMovements) {
      for (let i = 0; i < steps; i++) {
        switch (direction) {
          case 'R':
            tailPositions[0].x = tailPositions[0].x + 1;
            break;
          case 'U':
            tailPositions[0].y = tailPositions[0].y + 1;
            break;
          case 'L':
            tailPositions[0].x = tailPositions[0].x - 1;
            break;
          case 'D':
            tailPositions[0].y = tailPositions[0].y - 1;
            break;
        }

        let currentHeadPosition;

        for (let j = 1; j < tailPositions.length; j++) {
          currentHeadPosition = tailPositions[j - 1];
          const distance = {
            x: currentHeadPosition.x - tailPositions[j].x,
            y: currentHeadPosition.y - tailPositions[j].y,
          };

          if (
            (Math.abs(distance.x) >= 2 || Math.abs(distance.y) >= 2) &&
            currentHeadPosition.x == tailPositions[j].x
          ) {
            tailPositions[j].y += distance.y > 0 ? 1 : -1;
          } else if (
            (Math.abs(distance.x) >= 2 || Math.abs(distance.y) >= 2) &&
            currentHeadPosition.y == tailPositions[j].y
          ) {
            tailPositions[j].x += distance.x > 0 ? 1 : -1;
          } else if (
            (currentHeadPosition.x !== tailPositions[j].x &&
              Math.abs(distance.x) > 1) ||
            (currentHeadPosition.y !== tailPositions[j].y &&
              Math.abs(distance.y) > 1)
          ) {
            tailPositions[j].y +=
              currentHeadPosition.y > tailPositions[j].y ? 1 : -1;
            tailPositions[j].x +=
              currentHeadPosition.x > tailPositions[j].x ? 1 : -1;
          }
          currentHeadPosition = tailPositions[j];
        }
        uniquePositions.add(
          `${currentHeadPosition?.x ?? 0},${currentHeadPosition?.y ?? 0}`,
        );
      }
    }
    return uniquePositions.size;
  }

  runProblem9Part1(inputString: string[]): number {
    const headMovements: { direction: string; steps: number }[] =
      inputString.map((entry) => {
        const [direction, steps] = entry.split(' ');
        return { direction, steps: Number(steps) };
      });

    const headPosition = { x: 0, y: 0 };
    const tailPosition = { x: 0, y: 0 };
    const uniquePositions = new Set<string>();
    uniquePositions.add(`${tailPosition.x},${tailPosition.y}`);

    for (const { direction, steps } of headMovements) {
      for (let i = 0; i < steps; i++) {
        switch (direction) {
          case 'R':
            headPosition.x += 1;
            break;
          case 'U':
            headPosition.y += 1;
            break;
          case 'L':
            headPosition.x -= 1;
            break;
          case 'D':
            headPosition.y -= 1;
            break;
        }

        const distance = {
          x: headPosition.x - tailPosition.x,
          y: headPosition.y - tailPosition.y,
        };

        if (
          (Math.abs(distance.x) >= 2 || Math.abs(distance.y) >= 2) &&
          headPosition.x == tailPosition.x
        ) {
          tailPosition.y += distance.y > 0 ? 1 : -1;
        } else if (
          (Math.abs(distance.x) >= 2 || Math.abs(distance.y) >= 2) &&
          headPosition.y == tailPosition.y
        ) {
          tailPosition.x += distance.x > 0 ? 1 : -1;
        } else if (
          (headPosition.x !== tailPosition.x && Math.abs(distance.x) > 1) ||
          (headPosition.y !== tailPosition.y && Math.abs(distance.y) > 1)
        ) {
          tailPosition.y += headPosition.y > tailPosition.y ? 1 : -1;
          tailPosition.x += headPosition.x > tailPosition.x ? 1 : -1;
        }

        uniquePositions.add(`${tailPosition.x},${tailPosition.y}`);
      }
    }
    return uniquePositions.size;
  }

  runProblem8Part2(inputString: string[]): number {
    let finalScore = 0;
    const reverseInput: string[] = [];

    for (let i = 0; i < inputString.length; i++) {
      let columnString = '';
      for (let j = 0; j < inputString.length; j++) {
        columnString += inputString[j][i];
      }
      reverseInput.push(columnString);
    }

    const getDirectionScore = (str: string, size: number): number => {
      const numbers = str.split('').map((token: any) => Number(token));
      let score = 0;

      for (const treeSize of numbers) {
        if (treeSize >= size) {
          score += 1;
          break;
        }
        score += 1;
      }

      return score;
    };

    for (let i = 1; i < inputString.length - 1; i++) {
      for (let j = 1; j < reverseInput.length - 1; j++) {
        const treeSize = Number(inputString[i][j]);
        const westTrees = inputString[i]
          .substring(0, j)
          .split('')
          .reverse()
          .join('');
        const eastTrees = inputString[i].substring(
          j + 1,
          inputString[j].length,
        );
        const northTrees = reverseInput[j]
          .substring(0, i)
          .split('')
          .reverse()
          .join('');
        const southTrees = reverseInput[j].substring(
          i + 1,
          reverseInput[j].length,
        );

        const treeScore =
          getDirectionScore(westTrees, treeSize) *
          getDirectionScore(eastTrees, treeSize) *
          getDirectionScore(northTrees, treeSize) *
          getDirectionScore(southTrees, treeSize);

        if (treeScore > finalScore) {
          finalScore = treeScore;
        }
      }
    }

    return finalScore;
  }

  runProblem8Part1(inputString: string[]): number {
    let total = 0;
    const rowSize = inputString[0].length;
    const columnSize = inputString.length;
    total += 2 * (rowSize - 1) + 2 * (columnSize - 1);
    const reverseInput: string[] = [];

    for (let i = 0; i < inputString.length; i++) {
      let columnString = '';
      for (let j = 0; j < inputString.length; j++) {
        columnString += inputString[j][i];
      }
      reverseInput.push(columnString);
    }

    const isVisible = (str: string, size: number): boolean => {
      const numbers = str.split('').map((token: any) => Number(token));

      if (!numbers.some((e: number) => e >= size)) return true;

      return false;
    };

    for (let i = 1; i < inputString.length - 1; i++) {
      for (let j = 1; j < reverseInput.length - 1; j++) {
        const treeSize = Number(inputString[i][j]);
        const westTrees = inputString[i].substring(0, j);
        const eastTrees = inputString[i].substring(
          j + 1,
          inputString[j].length,
        );
        const northTrees = reverseInput[j].substring(0, i);
        const southTrees = reverseInput[j].substring(
          i + 1,
          reverseInput[j].length,
        );

        if (isVisible(westTrees, treeSize)) {
          total += 1;
          continue;
        }
        if (isVisible(eastTrees, treeSize)) {
          total += 1;
          continue;
        }
        if (isVisible(northTrees, treeSize)) {
          total += 1;
          continue;
        }
        if (isVisible(southTrees, treeSize)) {
          total += 1;
          continue;
        }
      }
    }
    return total;
  }

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

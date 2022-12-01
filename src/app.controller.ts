import { Controller, Get, Query, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  runProblem(@Query('day') day: number, @Query('part') part: number): number {
    return this.appService.runProblem(day, part);
  }
}

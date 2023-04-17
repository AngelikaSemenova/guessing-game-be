import { Body, Controller, Get, Post } from '@nestjs/common';
import { GuessTheNumberService } from './guess-the-number.service';

@Controller('guess-the-number')
export class GuessTheNumberController {
  constructor(private readonly guessTheNumberService: GuessTheNumberService) {}

  @Get('current-round')
  async getCurrentRoundTable() {
    return await this.guessTheNumberService.getCurrentRoundTable();
  }

  @Get('score')
  async getScore() {
    const score = await this.guessTheNumberService.getScore();
    return { score };
  }

  @Post('score')
  async calculateScore(@Body() { point, multiplier }) {
    const roundedNumber = await this.guessTheNumberService.calculateScore(
      point,
      multiplier,
    );
    return { roundedNumber };
  }

  @Get('ranking')
  async getRankingTable() {
    return await this.guessTheNumberService.getRankingTable();
  }
}

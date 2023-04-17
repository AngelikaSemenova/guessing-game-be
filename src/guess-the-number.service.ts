import { Injectable } from '@nestjs/common';
import { roundedNumber, roundedNumber1000 } from './utils';

@Injectable()
export class GuessTheNumberService {
  private currentRoundTable = [
    { name: 'You', point: 0, multiplier: 0 },
    { name: 'CPU 1', point: 0, multiplier: 0 },
    { name: 'CPU 2', point: 0, multiplier: 0 },
    { name: 'CPU 3', point: 0, multiplier: 0 },
    { name: 'CPU 4', point: 0, multiplier: 0 },
  ];
  private rankingTable = [
    { name: 'You', score: 0 },
    { name: 'CPU 1', score: 0 },
    { name: 'CPU 2', score: 0 },
    { name: 'CPU 3', score: 0 },
    { name: 'CPU 4', score: 0 },
  ];
  private score = 1000;

  async getCurrentRoundTable() {
    return this.currentRoundTable;
  }

  async setCurrentRoundTable(table) {
    this.currentRoundTable = table;
  }

  async calculateScore(point, multiplier) {
    const CPU1 = [roundedNumber1000(), roundedNumber()];
    const CPU2 = [roundedNumber1000(), roundedNumber()];
    const CPU3 = [roundedNumber1000(), roundedNumber()];
    const CPU4 = [roundedNumber1000(), roundedNumber()];

    await this.setCurrentRoundTable([
      { name: 'You', point: point, multiplier: multiplier },
      {
        name: 'CPU 1',
        point: CPU1[0],
        multiplier: CPU1[1],
      },
      {
        name: 'CPU 2',
        point: CPU2[0],
        multiplier: CPU2[1],
      },
      {
        name: 'CPU 3',
        point: CPU3[0],
        multiplier: CPU3[1],
      },
      {
        name: 'CPU 4',
        point: CPU4[0],
        multiplier: CPU4[1],
      },
    ]);

    const number = roundedNumber();
    if (multiplier <= number) {
      await this.addScore(point * multiplier);
    } else {
      await this.rmScore(point);
    }

    this.addToRankingTable([
      { name: 'You', score: multiplier <= number ? point * multiplier : 0 },
      { name: 'CPU 1', score: CPU1[1] <= number ? CPU1[0] * CPU1[1] : 0 },
      { name: 'CPU 2', score: CPU2[1] <= number ? CPU2[0] * CPU2[1] : 0 },
      { name: 'CPU 3', score: CPU3[1] <= number ? CPU3[0] * CPU3[1] : 0 },
      { name: 'CPU 4', score: CPU4[1] <= number ? CPU4[0] * CPU4[1] : 0 },
    ]);
    return number;
  }

  async getRankingTable(): Promise<any[]> {
    return this.rankingTable;
  }

  async getScore(): Promise<number> {
    return this.score;
  }

  async addScore(score: number): Promise<void> {
    this.score += score;
  }

  async rmScore(score: number): Promise<void> {
    this.score -= score;
  }

  addToRankingTable(table: any[]): void {
    this.rankingTable = table;
    this.sortRankingTable();
  }

  sortRankingTable(): void {
    this.rankingTable.sort((a, b) => b.score - a.score);
  }
}

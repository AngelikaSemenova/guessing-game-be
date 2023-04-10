import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as express from 'express';
import * as WebSocket from 'ws';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api');
  app.use(express.json());
  app.enableCors(); // включаем CORS
  const httpAdapter = app.getHttpAdapter();

  const wss = new WebSocket.Server({ port: 8080 });

  const roundedNumber = () => {
    const randomNumber = Math.random() * 10; // генерируем число от 0 до 10 с 1 знаком после запятой
    return Number(randomNumber.toFixed(2));
  };

  const roundedNumber1000 = () => {
    // генерируем число от 1 до 1000 без десятичных знаков
    return Math.floor(Math.random() * 1000) + 1;
  };

  class GuessTheNumberApi {
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

  const guessTheNumberApi = new GuessTheNumberApi();

  httpAdapter.get('/current-round', async (req, res) => {
    try {
      const table = await guessTheNumberApi.getCurrentRoundTable();
      res.json(table);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Обработчик GET запроса /score
  httpAdapter.get('/score', async (req, res) => {
    try {
      const score = await guessTheNumberApi.getScore();
      console.log(score);
      res.json({ score });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  httpAdapter.post('/score', async (req, res) => {
    try {
      const { point, multiplier } = req.body;
      const roundedNumber = await guessTheNumberApi.calculateScore(
        point,
        multiplier,
      );
      res.json({ roundedNumber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  httpAdapter.get('/ranking', async (req, res) => {
    try {
      const table = await guessTheNumberApi.getRankingTable();
      res.json(table);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  await app.listen(5000);

  wss.on('connection', (ws) => {
    ws.send(
      JSON.stringify({
        text: 'Welcome to the chat!',
        sender: 'CPU 1',
      }),
    );

    ws.on('message', (message) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const m = JSON.parse(message)
          client.send(JSON.stringify(m));
          client.send(JSON.stringify({
            text: m.text,
            sender: 'CPU 1',
          }));
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}
bootstrap();

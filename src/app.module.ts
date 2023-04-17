import { Module } from '@nestjs/common';
import { GuessTheNumberController } from './guess-the-number.controller';
import { GuessTheNumberService } from './guess-the-number.service';
import { WebsocketsGateway } from './websockets.gateway';
import { WsService } from './ws.service';

@Module({
  controllers: [GuessTheNumberController],
  providers: [GuessTheNumberService, WebsocketsGateway, WsService],
})
export class AppModule {}

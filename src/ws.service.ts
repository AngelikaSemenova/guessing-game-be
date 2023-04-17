import { Injectable } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';
import * as WebSocket from 'ws';

@Injectable()
export class WsService {
  constructor(private readonly gateway: WebsocketsGateway) {}

  async init() {
    const wss = new WebSocket.Server({ port: 8080 });
    this.gateway.server = wss;

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
            const m = JSON.parse(message.toString());
            client.send(JSON.stringify(m));
            client.send(JSON.stringify({ text: m.text, sender: 'CPU 1' }));
          }
        });
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}

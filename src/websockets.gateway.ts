import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  async afterInit() {
    console.log('WebSocket initialized');
  }

  async handleConnection() {
    console.log('WebSocket client connected');
  }

  async handleDisconnect() {
    console.log('WebSocket client disconnected');
  }
}

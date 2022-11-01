import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { NoticeService } from './notice.service';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: '',
  cors: {
    origin: ['http://localhost:3000'],
    allowedHeaders: [],
    credentials: true,
  },
})
export class NoticeGateway {
  constructor(private readonly noticeService: NoticeService) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('NoticeGateway');
}

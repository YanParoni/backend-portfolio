import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/notifications' })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('init');
  }

  handleConnection(client: Socket) {
    console.log('client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected:', client.id);
  }

  @SubscribeMessage('subscribeToTimeline')
  handleSubscribeToTimeline(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    client.join(`timeline_${userId}`);
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(`timeline_${userId}`).emit('notification', notification);
  }
}

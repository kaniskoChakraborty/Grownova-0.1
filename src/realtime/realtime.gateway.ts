import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Live events for the frontend. Connect with the access token:
 *   io('http://localhost:3000', { auth: { token: accessToken } })
 * Each socket joins its business's room, so a tenant only hears its own events.
 */
// ponytail: token is checked once on connect; an expired token keeps its socket until reconnect.
@WebSocketGateway({ cors: { origin: true } })
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer() private server?: Server;

  constructor(private readonly jwt: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const header = client.handshake.headers.authorization?.replace(/^Bearer /, '');
      const { businessId } = await this.jwt.verifyAsync<{ businessId: string }>(client.handshake.auth?.token ?? header);
      await client.join(`business:${businessId}`);
    } catch {
      client.emit('error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  emitToBusiness(businessId: string, event: string, payload: unknown) {
    this.server?.to(`business:${businessId}`).emit(event, payload);
  }
}

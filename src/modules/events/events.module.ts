import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '@/modules/auth/auth.module';
import { GatewaySessionManager } from '@/modules/events/gateway-session-manager';

@Module({
  imports: [AuthModule],
  providers: [EventsGateway, GatewaySessionManager],
  exports: [EventsGateway, GatewaySessionManager],
})
export class EventsModule {}

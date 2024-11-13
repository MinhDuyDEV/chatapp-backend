import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '@/entities/message.entity';
import { ConversationModule } from '@/modules/conversation/conversation.module';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { EventsModule } from '@/modules/events/events.module';
import { Services } from '@/shared/constants/services.enum';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => ConversationModule),
    EventsModule,
  ],
  controllers: [MessageController],
  providers: [
    {
      provide: Services.MESSAGES,
      useClass: MessageService,
    },
  ],
  exports: [
    {
      provide: Services.MESSAGES,
      useClass: MessageService,
    },
  ],
})
export class MessageModule {}

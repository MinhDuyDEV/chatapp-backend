import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '@/entities/message.entity';
import { ConversationModule } from '@/modules/conversation/conversation.module';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => ConversationModule),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

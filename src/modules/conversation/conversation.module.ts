import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/modules/user/user.module';
import { Conversation } from '@/entities/conversation.entity';
import { MessageModule } from '@/modules/message/message.module';

import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Services } from '@/shared/constants/services.enum';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    UserModule,
    forwardRef(() => MessageModule),
  ],
  controllers: [ConversationController],
  providers: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationService,
    },
  ],
  exports: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationService,
    },
  ],
})
export class ConversationModule {}

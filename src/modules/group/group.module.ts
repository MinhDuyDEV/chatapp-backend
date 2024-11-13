import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controller/group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '@/entities/group.entity';
import { GroupMessage } from '@/entities/group-message.entity';
import { UserModule } from '@/modules/user/user.module';
import { Services } from '@/shared/constants/services.enum';
import { GroupMessageController } from '@/modules/group/controller/group-messages.controller';
import { GroupMessageService } from '@/modules/group/services/group-messages.service';
import { GroupRecipientService } from '@/modules/group/services/group-recipient.service';
import { GroupRecipientsController } from '@/modules/group/controller/group-recipients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMessage]), UserModule],
  controllers: [
    GroupController,
    GroupMessageController,
    GroupRecipientsController,
  ],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessageService,
    },
    {
      provide: Services.GROUP_RECIPIENTS,
      useClass: GroupRecipientService,
    },
  ],
  exports: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessageService,
    },
  ],
})
export class GroupModule {}

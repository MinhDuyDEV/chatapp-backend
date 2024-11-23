import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { File } from '@/entities/file.entity';
import { MessageAttachment } from '@/entities/message-attachment.entity';
import { GroupMessageAttachment } from '@/entities/group-message-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
      Post,
      MessageAttachment,
      GroupMessageAttachment,
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

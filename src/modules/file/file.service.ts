import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { File } from '@/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';
import { ConfigService } from '@nestjs/config';
import { MessageAttachment } from '@/entities/message-attachment.entity';
import { GroupMessageAttachment } from '@/entities/group-message-attachment.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly configService: ConfigService,
    @InjectRepository(MessageAttachment)
    private readonly messageAttachmentRepository: Repository<MessageAttachment>,
    @InjectRepository(GroupMessageAttachment)
    private readonly groupMessageAttachmentRepository: Repository<GroupMessageAttachment>,
  ) {}

  private readonly s3Client = new S3Client({
    region: this.configService.get('config.aws.s3.region'),
    credentials: {
      accessKeyId: this.configService.get('config.aws.s3.accessKeyId'),
      secretAccessKey: this.configService.get('config.aws.s3.secretAccessKey'),
    },
  });

  async uploadFiles(
    files: Express.Multer.File[],
    data: UploadFileDto,
  ): Promise<UploadFileResponseDto[]> {
    const uploadPromises = files.map((file) => this.uploadMessage(file, data));
    return Promise.all(uploadPromises);
  }

  private async uploadMessage(
    file: Express.Multer.File,
    data: UploadFileDto,
  ): Promise<UploadFileResponseDto> {
    const { type } = data;
    const key = `${Date.now().toString()}-${file.originalname}`;

    // Upload file to S3
    const putCommand = new PutObjectCommand({
      Bucket: this.configService.get('config.aws.s3.bucket'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(putCommand);
    } catch (error) {
      console.log('Error uploading file to S3', error);
      throw new InternalServerErrorException();
    }

    let newFile;
    if (type === 'message') {
      newFile = await this.messageAttachmentRepository.save({
        id: uuid(),
        name: file.originalname,
        key,
        type,
        mimetype: file.mimetype,
      });
    } else if (type === 'group-message') {
      newFile = await this.groupMessageAttachmentRepository.save({
        id: uuid(),
        name: file.originalname,
        key,
        type,
        mimetype: file.mimetype,
      });
    }

    if (!newFile) {
      throw new InternalServerErrorException('Error saving file to database');
    }

    return {
      id: newFile.id,
      url: newFile.url,
      mimetype: newFile.mimetype,
    };
  }

  async deleteFileFromS3(key: string): Promise<void> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.configService.get('config.aws.s3.bucket'),
      Key: key,
    });

    try {
      await this.s3Client.send(deleteCommand);
    } catch (error) {
      console.log('Error deleting file from S3', error);
      throw new InternalServerErrorException('Error deleting file from S3');
    }
  }

  async cleanUpJunkFiles(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const junkFiles = await this.fileRepository.find({
      where: { post: null, createdAt: LessThan(yesterday) },
    });

    for (const file of junkFiles) {
      try {
        await this.deleteFileFromS3(file.key);
        await this.fileRepository.remove(file);
      } catch (error) {
        console.log('Error cleaning up junk file', error);
      }
    }
  }
}

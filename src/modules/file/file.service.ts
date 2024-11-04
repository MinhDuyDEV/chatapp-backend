import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { File } from '@/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
  });

  async upload(
    file: Express.Multer.File,
    data: UploadFileDto,
  ): Promise<UploadFileResponseDto> {
    const { type } = data;
    const key = `${Date.now().toString()}-${file.originalname}`;

    // Upload file to S3
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
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

    // Save file to database
    const newFile = await this.fileRepository.save({
      id: uuid(),
      name: file.originalname,
      key,
      type,
      url: `${process.env.CLOUDFRONT_URL}/${key}`,
    });
    if (!newFile) {
      throw new InternalServerErrorException('Error saving file to database');
    }

    const signedUrl = getSignedUrl({
      url: newFile.url,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      dateLessThan: new Date(Date.now() + 60 * 60 * 1000).toDateString(), // expires in 1 hour
    });

    return {
      url: signedUrl,
    };
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    data: UploadFileDto,
  ): Promise<UploadFileResponseDto[]> {
    const uploadPromises = files.map((file) => this.upload(file, data));

    const uploadedFiles = await Promise.all(uploadPromises);

    return uploadedFiles;
  }
}

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      this.logger.log(`File uploaded successfully. URL: ${url}`);
      return url;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to upload file. Error: ${error.message}`);
        throw new Error(`Failed to upload file. ${error.message}`);
      } else {
        this.logger.error('Failed to upload file. Unknown error.');
        throw new Error('Failed to upload file. Unknown error.');
      }
    }
  }

  async deleteFile(url: string): Promise<void> {
    const key = url.split('/').pop();

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully. Key: ${key}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete file. Error: ${error.message}`);
        throw new Error(`Failed to delete file. ${error.message}`);
      } else {
        this.logger.error('Failed to delete file. Unknown error.');
        throw new Error('Failed to delete file. Unknown error.');
      }
    }
  }

  getBucketName(): string {
    return this.bucketName;
  }
}

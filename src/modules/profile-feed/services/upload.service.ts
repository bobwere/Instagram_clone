import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
const sharp = require('sharp');

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  private readonly bucket: string;
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const region = this.configService.get<string>('AWS_REGION');
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!accessKeyId || !secretAccessKey || !region || !this.bucket) {
      throw new Error('Missing AWS configuration');
    }

    this.s3 = new AWS.S3({
      region: region,
      endpoint:  `https://${region}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY'
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    if (!file || !file.buffer || !file.originalname || !file.mimetype) {
      throw new BadRequestException('Invalid file');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`,
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

     // Process image with sharp
    const processedImageBuffer = await sharp(file.buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .toBuffer();
  
    // Update file buffer with processed image
    file.buffer = processedImageBuffer;

    const key = `${Date.now()}-${file.originalname}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const uploadResult = await this.s3.upload(params).promise();

    return {
      url: uploadResult.Location,
    };
  }

  async deleteFile(key: string): Promise<void> {
    if (!key) {
      throw new BadRequestException('Invalid key');
    }

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.bucket,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }
}

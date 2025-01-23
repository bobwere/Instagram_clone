import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileFeedDto } from '../dtos/create-profile-feed.dto';
import { FileValidationOptions } from '../interfaces/storage-config.interface';
import { UploadService } from './upload.service';
import { Feed } from '@/domain/feed.entity';
import { User } from '@/domain/user.entity';
// import sharp from 'sharp';


@Injectable()
export class ProfileFeedService {

  private readonly validationOptions: FileValidationOptions = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
  };

  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    private readonly uploadService: UploadService,
  ) {}

  async uploadPhoto(file: Express.Multer.File) {
    this.validateFile(file);

    return this.uploadService.uploadFile(file);
  }

  async create(
    user: User,
    createProfileFeedDto: CreateProfileFeedDto,
  ): Promise<Feed> {
    console.log('userid', user);
    const photo = this.feedRepository.create({
      user_id: user.id,
      url: createProfileFeedDto.url,
      description: createProfileFeedDto.description,
      hashtags: createProfileFeedDto.hashtags || [],
    });

    return this.feedRepository.save(photo);
  }

  async findAllByUser(userId: string): Promise<Feed[]> {
    return this.feedRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Feed> {
    const photo = await this.feedRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    return photo;
  }

  async remove(userId: string, id: string): Promise<void> {
    const photo = await this.findOne(id);

    if (photo.user_id !== userId) {
      throw new BadRequestException('You can only delete your own photos');
    }

    // Extract key from URL
    const key = photo.url.split('/').pop();
    if (key) {
      await this.uploadService.deleteFile(key);
    }

    await this.feedRepository.remove(photo);
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.size > this.validationOptions.maxSize) {
      throw new BadRequestException(
        `File size exceeds ${this.validationOptions.maxSize / 1024 / 1024}MB limit`,
      );
    }

    if (!this.validationOptions.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed types: ' +
          this.validationOptions.allowedMimeTypes.join(', '),
      );
    }
  }
}

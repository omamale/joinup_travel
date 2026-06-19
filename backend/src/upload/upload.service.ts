import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) throw new BadRequestException('No file provided');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) throw new BadRequestException('File size must be under 5MB');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `joinup/${folder}`, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
        (error, result) => {
          if (error) reject(new BadRequestException('Upload failed: ' + error.message));
          else resolve(result!.secure_url);
        },
      );
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}

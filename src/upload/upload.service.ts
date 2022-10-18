import { Injectable } from '@nestjs/common';
import { FileInfoDto } from './dto/fileInfo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from 'src/entities/files.entity';
import { Repository } from 'typeorm';
import { Directory } from 'src/entities/directory.entity';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  private readonly S3: AWS.S3;
  private readonly region: string;
  private readonly bucketName: string;
  private readonly ACL: string;

  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    @InjectRepository(Directory)
    private readonly directoryRepository: Repository<Directory>,
  ) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
    this.S3 = new AWS.S3();
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    this.region = process.env.AWS_REGION;
    this.ACL = 'public-read';
  }
  // 버킷 생성
  async __createBucket() {
    return await this.S3.createBucket({
      Bucket: this.bucketName,
    }).promise();
  }

  // src 생성
  __makePublicUrl(dest) {
    return `https://${this.bucketName}.s3.${
      this.region
    }.amazonaws.com/${encodeURI(dest)}`;
  }

  // S3 파일 업로드
  async s3UpLoadFromBinary(
    file: Express.Multer.File,
    title: string,
    metadata: string,
    folder?: string,
  ) {
    const Key = `${metadata}-${title}`;

    folder = folder ? folder : 'default';

    try {
      const result = await this.S3.putObject({
        Bucket: `${this.bucketName}/${folder}`,
        ACL: this.ACL,
        Key,
        Body: file.buffer,
      }).promise();

      return {
        ok: true,
        ETag: result.ETag,
        Key,
        url: this.__makePublicUrl(`${folder}/${Key}`),
      };
    } catch (error) {
      console.log(error);

      return { ok: false };
    }
  }

  fileTypeCheck(mimetype: string) {
    switch (mimetype) {
      case 'audio/wav':
        return '.wav';
      case 'audio/wave':
        return '.wav';
      case 'audio/mp3':
        return '.mp3';
      default:
        break;
    }
  }

  // 파일, 정보 저장
  async fileUpload(file: Express.Multer.File, fileInfo: FileInfoDto) {
    const result = {
      status: 201,
      success: true,
      url: '',
    };

    await this.filesRepository
      .createQueryBuilder()
      .insert()
      .into(Files)
      .values({
        title: fileInfo.title,
        writer: fileInfo.writer,
        release_date: fileInfo.release_date,
        file_type: file.mimetype,
        purpose: fileInfo.purpose,
        mood: fileInfo.mood,
        tempo: fileInfo.tempo,
        genre: fileInfo.genre,
        category1: fileInfo.category1,
        category2: fileInfo.category2,
        category3: fileInfo.category3,
      })
      .execute();

    const findFile: any = await this.filesRepository
      .createQueryBuilder('file')
      .select('file.file_id')
      .addSelect('file.title')
      .addSelect('file.writer')
      .where('file.writer=:writer', { writer: fileInfo.writer })
      .andWhere('file.title=:title', { title: fileInfo.title })
      .getOne();

    console.log(findFile);

    const s3 = await this.s3UpLoadFromBinary(
      file,
      fileInfo.title + this.fileTypeCheck(file.mimetype),
      findFile.file_id,
      fileInfo.writer,
    );

    if (s3.ok) {
      await this.filesRepository
        .createQueryBuilder()
        .update(Files)
        .set({
          file_url: s3.url,
        })
        .where('', {})
        .execute();

      result.url = `${s3.url}`;
    }

    return result;
  }
}

import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from 'src/entities/files.entity';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { Wait } from 'src/entities/wait.entity';
import { Users } from 'src/entities/users.entity';
import { Downloads } from 'src/entities/downloads.entity';

@Injectable()
export class DownloadService {
  private readonly S3: AWS.S3;
  private readonly region: string;
  private readonly bucketName: string;
  private readonly ACL: string;

  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    @InjectRepository(Wait) private readonly waitRepository: Repository<Wait>,
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Downloads)
    private readonly downloadsRepository: Repository<Downloads>,
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

  async createFilePath(fileName: string) {
    const result = { path: '' };

    return result;
  }

  async downloadFileS3(fileId: string, userId: string) {
    // const files: string[] = [];
    const options = {
      Bucket: this.bucketName,
      Key: ``,
    };

    const findFile = await this.filesRepository
      .createQueryBuilder('file')
      .select('file.file_id')
      .addSelect('file.file_url')
      .addSelect('file.title')
      .where('file.file_id=:id', { id: Number(fileId) })
      .getOne();

    console.log('find file');

    options.Key = findFile.file_url.slice(58);
    console.log(options);
    console.log(findFile.title);

    const user = new Users();
    const file = new Files();
    const readStream = this.S3.getObject(options).createReadStream();
    const writeStream = fs.createWriteStream(`file/${findFile.title}.wav`);
    const filePath = '';

    user.user_id = userId;
    file.file_id = findFile.file_id;

    this.downloadsRepository
      .createQueryBuilder('download')
      .insert()
      .into('Downloads')
      .values({ user: user, file_id: file, path: `file/${findFile.title}.wav` })
      .execute();

    readStream.pipe(writeStream);

    return;
  }
}

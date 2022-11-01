import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from 'src/entities/notice.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice) private repositoryNotice: Repository<Notice>,
    @InjectRepository(Users) private repositoryUsers: Repository<Users>,
  ) {}

  async getNoticeLs(id: string) {
    const result = {
      status: 201,
      noticeLs: [],
    };

    const findNotice = await this.repositoryNotice
      .createQueryBuilder('fn')
      .leftJoinAndSelect('fn.user', 'user')
      .select([
        'fn.notice_no',
        'fn.user',
        'fn.title',
        'fn.content',
        'user.user_id',
      ])
      .where('fn.user=:id', { id: id })
      .getMany();

    console.log(findNotice[0].user.user_id);
    result.noticeLs = findNotice;

    return result;
  }

  async createNoticeLs() {
    const result = {};

    return result;
  }
}

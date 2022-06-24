import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/userinfo.entity';
import { Users } from 'src/entities/Users.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private dataSource: DataSource,
  ) {}
}

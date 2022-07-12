import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/userinfo.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { ContractInfoDTO } from './dto/contractInfo.dto';
import { UserInfoUpdateDTO } from './dto/userInfoUpdata.dto';
import { ErrorResponse } from 'src/common/error/ErrorResponse';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private readonly errorResponse: ErrorResponse,
  ) {}

  // 계약 진행 전 회사 정보 입력
  async acceptContract(info: ContractInfoDTO) {
    const result = {
      status: 201,
      success: true,
      message: '정보 입력이 완료되었습니다.',
    };

    try {
      const userInfo = this.userInfoRepository.create(info);
      const saveUserInfo = await this.userInfoRepository.save(userInfo);

      console.log(saveUserInfo);
    } catch (error) {
      console.log(error);

      this.errorResponse.Internal_Server();
    }

    return result;
  }

  // 유저 정보 업데이트
  async userInfoUpDate(user_id: string, update: UserInfoUpdateDTO) {
    const result = {
      status: 201,
      success: true,
      message: '',
    };
    const updateInfo = {};
    const updateKeys = Object.keys(update);

    for (const key of updateKeys) {
      if (update[key] !== '') {
        updateInfo[key] = update[key];
      }
    }

    try {
      await this.userInfoRepository
        .createQueryBuilder()
        .update()
        .set(updateInfo)
        .where('userIdUserId = :id', { id: user_id })
        .execute();

      result.message = `${user_id}님의 정보가 업데이트 되었습니다.`;
    } catch (error) {
      console.log(error);
    }

    return result;
  }

  async getUsers(tier?: number) {
    const result = {
      status: 200,
      success: true,
      users: [],
      message: '',
    };

    switch (tier) {
      case 0:
        break;
      case 1:
        break;
      case 8:
      case 9:
      case 10:
        // const;
        break;
      default:
        break;
    }
    return result;
  }
}

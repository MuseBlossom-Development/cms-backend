import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { UserView } from 'src/entities/userView.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserView)
    private userViewRepository: Repository<UserView>,
    private readonly errorResponse: ErrorResponse,
  ) {}
  async getUsers(tier?: number) {
    try {
      const users =
        tier === NaN
          ? await this.userViewRepository
              .createQueryBuilder('user')
              .select()
              .where('user.tier = :tier', { tier })
              .getMany()
          : await this.userViewRepository
              .createQueryBuilder('user')
              .select()
              .getMany();

      const reUsers = users.map((u) => {
        const reU = {
          com_num: u.com_num,
          com_name: u.com_name,
          email: u.email,
          create_at: u.create_at,
          tier: u.tier,
          accept: false,
        };

        reU.accept = u.subscription !== null ? true : false;

        return reU;
      });

      const result = {
        status: 200,
        user: reUsers,
        success: true,
      };
      return result;
    } catch (error) {
      console.log(error);
      this.errorResponse.BadRequest();
    }
  }
}

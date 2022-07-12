import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { Help } from 'src/entities/help.entity';
import { Repository } from 'typeorm';
import { HelpDTO } from './dto/help.dto';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(Help) private helpRepository: Repository<Help>,
    private readonly errorResponse: ErrorResponse,
  ) {}

  async help(helpDto: HelpDTO) {
    const result = {
      status: 201,
      message: '문의가 접수되었습니다.',
      success: true,
    };

    const type = helpDto.type;
    const name = helpDto.name;
    const email = helpDto.email;
    const contact_info = helpDto.info;
    const content = helpDto.contents;

    try {
      this.helpRepository
        .createQueryBuilder()
        .insert()
        .into(Help)
        .values([{ type, name, email, contact_info, content }])
        .execute();
    } catch (error) {
      console.log('에러:', error);
      this.errorResponse.Internal_Server;
    }

    return result;
  }

  async helpList(name?: string) {
    const result = {
      status: 200,
      help: [],
      success: true,
    };

    try {
      if (name) {
        result.help = await this.helpRepository
          .createQueryBuilder('help')
          .select()
          .where('help.name = :name', { name })
          .getMany();
      } else {
        result.help = await this.helpRepository
          .createQueryBuilder('help')
          .select()
          .getMany();
      }
    } catch (error) {
      console.log('error:', error);

      this.errorResponse.Internal_Server();
    }

    return result;
  }
}

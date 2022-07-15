import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ErrorResponse } from 'src/common/error/ErrorResponse';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private errorResponse: ErrorResponse) {
    super();
  }

  async validate() {
    const user = 1;

    if (!user) {
      this.errorResponse.BadRequest('다시 로그인해주세요.');
    }
    return user;
  }
}

import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private errorResponse: ErrorResponse,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { accesstoken, refreshtoken } = request.headers;
    const secretAccess = process.env.JWT_ACCESS_TOKEN_SECRET;
    const secretRefresh = process.env.JWT_REFRESH_TOKEN_SECRET;
    let access: string;
    let refresh: string;

    try {
      access = accesstoken.split(' ')[1];
      refresh = refreshtoken.split(' ')[1];
    } catch (error) {
      this.errorResponse.Forbidden();
    }

    try {
      this.jwtService.verify(access, { secret: secretAccess });
    } catch (error) {
      const verify = await this.authService.validateToken(
        refresh,
        secretRefresh,
        'refresh',
      );

      if (!verify) {
        this.errorResponse.Unauthorized('로그인 시간이 만료 되었습니다.');
      }
    }

    return true;
  }
}

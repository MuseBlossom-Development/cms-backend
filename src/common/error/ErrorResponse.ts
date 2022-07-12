import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorResponse {
  Internal_Server() {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: '알 수 없는 오류가 발생했습니다. \n관리자에게 문의하십시오.',
        success: false,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  BadRequest(error?: string) {
    throw new HttpException(
      { status: HttpStatus.BAD_REQUEST, error, success: false },
      HttpStatus.BAD_REQUEST,
    );
  }

  Unauthorized() {
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: '로그인이 필요한 서비스입니다.',
        success: false,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  Forbidden() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: '잘못된 접근입니다.',
        success: false,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

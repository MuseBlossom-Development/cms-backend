import { Module } from '@nestjs/common';
import { ErrorResponse } from './error/ErrorResponse';

@Module({
  exports: [ErrorResponse],
})
export class CommonModule {}

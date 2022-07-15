import { Module } from '@nestjs/common';
import { ErrorResponse } from './error/ErrorResponse';

@Module({
  imports: [],
  exports: [ErrorResponse],
})
export class CommonModule {}

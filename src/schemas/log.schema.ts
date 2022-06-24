import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  logging: string;

  @Prop({ type: Date })
  create_at: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

@Schema()
export class Email {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  email: string;

  @Prop()
  auth_num: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);

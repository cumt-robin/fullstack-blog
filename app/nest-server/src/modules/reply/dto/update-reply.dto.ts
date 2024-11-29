import { PartialType } from '@nestjs/mapped-types';
import { CreateReplyDto } from './create-reply.dto';

export class UpdateReplyDto extends PartialType(CreateReplyDto) {}

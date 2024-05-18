import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscribeDto } from './create-subscribe.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSubscribeDto extends PartialType(CreateSubscribeDto) {
}

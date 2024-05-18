import { PartialType } from '@nestjs/mapped-types';
import { CreateRoadstatusDto } from './create-roadstatus.dto';

export class UpdateRoadstatusDto extends PartialType(CreateRoadstatusDto) {}

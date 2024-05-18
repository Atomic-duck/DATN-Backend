import { IsArray, ArrayMinSize, IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Options {
   @IsBoolean()
   avoidRain: boolean;

   @IsBoolean()
   avoidFlooded: boolean;
}

export class FindRoutesRequest {
   @IsArray()
   @ArrayMinSize(2, { message: 'Waypoints array must contain at least 2 coordinates.' })
   waypoints: [number, number][];

   @ValidateNested()
   @Type(() => Options)
   options: Options;
}


import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty, ArrayMinSize, IsDateString, IsEmail, Validate, ValidateNested, IsInt, Min, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { TimeFormat } from '../pipes/time-format-validation.pipe';
import { Type } from 'class-transformer';

class WaypointDto {
   @IsNotEmpty()
   @IsArray()
   @ArrayMinSize(2, { message: 'Coordinates must contain exactly 2 numbers' })
   coordinates: [number, number];

   @IsNotEmpty()
   @IsString()
   name: string;
}

export class CreateSubscribeDto {
   @IsNotEmpty()
   @IsEmail({}, { message: 'Invalid email format' })
   email: string;

   @IsNotEmpty()
   @IsArray()
   @ArrayNotEmpty()
   @ArrayMinSize(2)
   coordinates: [number, number][];

   @IsNotEmpty()
   @IsArray()
   @ArrayNotEmpty({ message: 'Waypoints array must not be empty' })
   @Type(() => WaypointDto)
   @ValidateNested({ each: true })
   waypoints: WaypointDto[];

   @IsNotEmpty()
   @IsNumber()
   @Min(0, { message: 'Distance must be greater than zero' })
   distance: number;

   @IsNotEmpty()
   @IsString()
   name: string;

   @IsNotEmpty()
   @IsString()
   @Validate(TimeFormat)
   start: string;

   @IsNotEmpty()
   @IsString()
   @Validate(TimeFormat)
   end: string;

   @IsNotEmpty()
   @IsArray()
   @ArrayMinSize(1)
   // validate
   repeat: number[];

   @IsBoolean()
   @IsOptional()
   isOn?: boolean;

   @IsNumber()
   @IsOptional()
   once?: number;
}

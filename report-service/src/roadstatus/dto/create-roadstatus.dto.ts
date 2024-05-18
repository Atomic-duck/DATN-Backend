import { Transform } from 'class-transformer';
import { IsNotEmpty, IsArray, ArrayMinSize, IsEmail } from 'class-validator';

export class CreateRoadstatusDto {
   @IsNotEmpty()
   @IsEmail({}, { message: 'Invalid email format' })
   email: string;

   @IsNotEmpty()
   @Transform(({ value }) => JSON.parse(value))
   @IsArray()
   @ArrayMinSize(2)
   coordinates: [number, number];

   @IsNotEmpty()
   @Transform(({ value }) => JSON.parse(value))
   @IsArray()
   conditions: [any];

   @IsNotEmpty()
   @Transform(({ value }) => parseInt(value))
   timestamp: number;
}

import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsNotEmpty()
   @IsEmail()
   email: string;

   @IsNotEmpty()
   @IsString()
   googleId: string; // Ensure that this field is populated when registering with Google
}

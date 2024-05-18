import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.createUser(createUserDto);
      return { success: true, data: newUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('login')
  async login(@Body() credentials: { googleId: string }) {
    try {
      // Implement your authentication logic here
      const user = await this.usersService.authenticate(credentials.googleId);
      if (user) {
        return { success: true, data: user };
      } else {
        return { success: false, message: 'Bạn cần đăng ký tài khoản trước' };
      }
    } catch (error) {
      return { success: false, message: 'Failed to login' };
    }
  }
}

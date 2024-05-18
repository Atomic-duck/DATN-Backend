import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findOne({ googleId: createUserDto.googleId }).exec(); // Find a user by Google ID
      if (user) {
        throw new Error('Tài khoản đã đăng ký trước đó')
      }

      const createdUser = new this.userModel(createUserDto); // Create a new user instance
      return await createdUser.save(); // Save the user to the database
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async authenticate(googleId: string): Promise<User> {
    try {
      return await this.userModel.findOne({ googleId }).exec(); // Find a user by Google ID
    } catch (error) {
      this.logger.error(`Error authenticating user: ${error.message}`);
      throw error;
    }
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: {
      username: string;
      email: string;
      password: string;
    },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Post('login')
  async loginUser(
    @Body()
    loginData: {
      email: string;
      password: string;
    },
  ): Promise<{ message: string }> {
    const isAuthenticated = await this.userService.authenticateUser(loginData);

    if (isAuthenticated) {
      return { message: 'Login successful' };
    } else {
      return { message: 'Invalid email or password' };
    }
  }
}

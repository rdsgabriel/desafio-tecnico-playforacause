import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

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

  /*
  @Get('allusers')
    async getAllUsers(): Promise<UserModel[]> {
      return this.prisma.user.findMany();
  } só pra teste.
  */

  @Post('login')
  async loginUser(
    @Body()
    loginData: {
      email: string;
      password: string;
    },
  ): Promise<{ message: string; userId?: number }> {
    const isAuthenticated = await this.userService.authenticateUser(loginData);

    if (isAuthenticated) {
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
      }); // pra retornar o id

      return {
        message: 'Login successful',
        userId: user.id,
      };
    }

    throw new UnauthorizedException('Email or password invalid'); // tratamento de erro do nest
  }
}

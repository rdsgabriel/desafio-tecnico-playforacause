import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const userEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    const userName = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (userEmail) {
      throw new HttpException('E-mail já está em uso.', HttpStatus.CONFLICT);
    }

    if (userName) {
      throw new HttpException(
        'Nome de usuário já está em uso.',
        HttpStatus.CONFLICT,
      );
    }

    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashed,
      },
    });
  }

  async authenticateUser(loginData: {
    email: string;
    password: string;
  }): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      return false; // Usuário não encontrado
    }
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    return isPasswordValid;
  }
}

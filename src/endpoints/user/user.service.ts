import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { validate as uuidValidate } from 'uuid';
import { db } from 'src/services/db';

@Injectable()
export class UserService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }
    const newUser = await db.user.create({
      data: {
        login,
        password,
        version: 1,
      },
    });

    const result = this.changeUserDate(newUser);
    delete result.password;
    return result;
  }

  async findAll() {
    const users = await db.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const result = users.map((user) => {
      return this.changeUserDate(user);
    });
    return result;
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid userId provided. Please provide a valid UUID.',
      );
    }
    const user = await db.user.findUnique({
      where: { id },
    });
    if (!user)
      throw new NotFoundException('User with the provided id does not exist.');
    return this.changeUserDate(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword } = updateUserDto;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException(
        'Invalid oldPassword or newPassword provided. Please provide a valid fields.',
      );
    }
    const user = await this.findUser(id);
    if (user.password !== oldPassword) {
      throw new ForbiddenException(
        'Old password is incorrect. Please provide the correct old password.',
      );
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: { increment: 1 },
        updatedAt: new Date(),
      },
    });
    const result = this.changeUserDate(updatedUser);
    delete result.password;
    return result;
  }

  async remove(id: string) {
    await this.findUser(id);
    await db.user.delete({ where: { id } });
    return `User with id ${id} removed successfully.`;
  }

  async findUser(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid userId provided. Please provide a valid UUID.',
      );
    }
    const user = await db.user.findUnique({ where: { id } });
    if (!user)
      throw new NotFoundException('User with the provided id does not exist.');
    return user;
  }

  private changeUserDate = (user) => {
    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  };
}

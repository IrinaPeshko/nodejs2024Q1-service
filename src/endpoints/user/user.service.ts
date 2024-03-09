import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }
    const newUser = new User();
    newUser.id = uuidv4();
    newUser.login = login;
    newUser.password = password;
    newUser.version = 1;
    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();
    this.users.push(newUser);
    const response = { ...newUser };
    delete response.password;
    return response;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid userId provided. Please provide a valid UUID.',
      );
    }
    const user = this.users.find((user) => user.id === id);
    if (!user)
      throw new NotFoundException('User with the provided id does not exist.');
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword } = updateUserDto;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException(
        'Invalid oldPassword or newPassword provided. Please provide a valid fields.',
      );
    }
    const updatedUserIndex = this.findUserId(id);
    const user = this.users[updatedUserIndex];
    if (user.password !== oldPassword) {
      throw new ForbiddenException(
        'Old password is incorrect. Please provide the correct old password.',
      );
    }

    const updatedUser: User = {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    this.users[updatedUserIndex] = updatedUser;
    const response = { ...updatedUser };
    delete response.password;
    return response;
  }

  remove(id: string) {
    const userIndex = this.findUserId(id);
    this.users.splice(userIndex, 1);
    return `This action removes a #${id} user`;
  }

  private findUserId(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid userId provided. Please provide a valid UUID.',
      );
    }
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1)
      throw new NotFoundException('User with the provided id does not exist.');
    return userIndex;
  }
}

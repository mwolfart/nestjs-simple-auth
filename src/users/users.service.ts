import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10),
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(uuid: string) {
    return this.prismaService.user.findUnique({
      where: { id: uuid },
    });
  }

  update(uuid: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id: uuid },
      data: updateUserDto,
    });
  }

  remove(uuid: string) {
    return this.prismaService.user.delete({
      where: { id: uuid },
    });
  }
}

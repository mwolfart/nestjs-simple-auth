import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly caslAbilityService: CaslAbilityService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const ability = this.caslAbilityService.ability;

    if (!ability.can('create', 'User')) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10),
      },
    });
  }

  findAll() {
    const ability = this.caslAbilityService.ability;

    if (!ability.can('read', 'User')) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prismaService.user.findMany();
  }

  findOne(uuid: string) {
    const ability = this.caslAbilityService.ability;

    if (!ability.can('read', 'User')) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prismaService.user.findUnique({
      where: { id: uuid },
    });
  }

  update(uuid: string, updateUserDto: UpdateUserDto) {
    const ability = this.caslAbilityService.ability;

    if (!ability.can('update', 'User')) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prismaService.user.update({
      where: { id: uuid },
      data: updateUserDto,
    });
  }

  remove(uuid: string) {
    const ability = this.caslAbilityService.ability;

    if (!ability.can('delete', 'User')) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prismaService.user.delete({
      where: { id: uuid },
    });
  }
}

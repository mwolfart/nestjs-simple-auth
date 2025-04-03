import { accessibleBy } from '@casl/prisma';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly caslAbilityService: CaslAbilityService,
  ) {}

  create(createPostDto: CreatePostDto & { authorId: string }) {
    const ability = this.caslAbilityService.ability;

    if (!ability.can('create', 'Post')) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prismaService.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    const ability = this.caslAbilityService.ability;

    return this.prismaService.post.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').Post],
      },
    });
  }

  findOne(id: string) {
    const ability = this.caslAbilityService.ability;

    return this.prismaService.post.findUnique({
      where: { id, AND: accessibleBy(ability, 'read').Post },
    });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const ability = this.caslAbilityService.ability;

    return this.prismaService.post.update({
      where: { id, AND: accessibleBy(ability, 'update').Post },
      data: updatePostDto,
    });
  }

  remove(id: string) {
    const ability = this.caslAbilityService.ability;

    return this.prismaService.post.delete({
      where: { id, AND: accessibleBy(ability, 'delete').Post },
    });
  }
}

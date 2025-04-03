import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredRoles } from 'src/auth/required-roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@UseGuards(AuthGuard, RoleGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @RequiredRoles(Role.WRITER, Role.EDITOR)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create({
      ...createPostDto,
      authorId: req.user!.id,
    });
  }

  @RequiredRoles(Role.WRITER, Role.EDITOR, Role.READER)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @RequiredRoles(Role.WRITER, Role.EDITOR, Role.READER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @RequiredRoles(Role.EDITOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const post = await this.postsService.update(id, updatePostDto);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @RequiredRoles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const post = await this.postsService.remove(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}

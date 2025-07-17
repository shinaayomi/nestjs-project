import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';

import { CreatePostDto } from './dto/create-post-dto';
import { PostExistsPipe } from './pipes/post-exists-pipe';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/auth/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id') // dynamic id
  async findOne(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // this pipes validation is used if it is not configured globally
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async create(
    @Body() createPostData: CreatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostData, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostData, user);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<void> {
    await this.postsService.remove(id);
  }
}

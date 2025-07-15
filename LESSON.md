## Post Service Dummy

```bash
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post as PostInterface } from './interface/post.interface';

@Injectable()
export class PostsService {
  private posts: PostInterface[] = [
    {
      id: 1,
      title: 'First',
      content: 'First post content',
      authorName: 'Shinaayomi',
      createdAt: new Date(),
    },
  ];


  async findAll(): PostInterface[] {
    return this.posts.find();
  }

  async findOne(id: number): PostInterface {
    const singlePost = this.posts.find(post => post.id === id);

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }

    return singlePost;
  }

   create(createPostData: Partial<Omit<PostInterface, 'id' | 'createdAt'>>): PostInterface {
    const newPost: Post = {
      id: this.getNextId(),
      ...createPostData,
      createdAt: new Date(),
    };

    this.posts.push(newPost);
    return newPost;
  }

  update(
    id: number,
    updatePostData: Partial<Omit<PostInterface, 'id' | 'createdAt'>>
  ): PostInterface {
    const currentPostIndexToEdit = this.posts.findIndex(
      (post) => post.id === id,
    );

    // Did not exist/present
    if (currentPostIndexToEdit === -1) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }

    this.posts[currentPostIndexToEdit] = {
      ...this.posts[currentPostIndexToEdit],
      ...updatePostData,
      updatedAt: new Date(),
    };
    return this.posts[currentPostIndexToEdit];
  }

  remove(id: number): { message: string } {
    const currentPostIndexToDelete = this.posts.findIndex(
      (post) => post.id === id,
    );

    if (currentPostIndexToDelete === -1) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }

    this.posts.splice(currentPostIndexToDelete, 1);

    return { message: `Post with ID ${id} has been deleted` };
  }

  private getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }
}
```

## Post Controller Dummy

```bash
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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostInterface } from './interface/post.interface';
import { CreatePostDto } from './dto/create-post-dto';
import { PostExistsPipe } from './pipes/post-exists-pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('search') search?: string): PostInterface[] {
    const extractAllPosts = this.postsService.findAll();

    if (search) {
      return extractAllPosts.filter((singlePost) =>
        singlePost.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return extractAllPosts;
  }

  @Get(':id') // dynamic id
  findOne(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): PostInterface {
    return this.postsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // this pipes validation is used if it is not configured globally
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Body() createPostData: CreatePostDto,
    // @Body() createPostData: Omit<PostInterface, 'id' | 'createdAt'>,
  ): PostInterface {
    return this.postsService.create(createPostData);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body() updatePostData: Partial<Omit<PostInterface, 'id' | 'createdAt'>>,
  ): PostInterface {
    return this.postsService.update(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe, PostExistsPipe) id: number): void {
    this.postsService.remove(id);
  }
}

```

## Authentication And Authorization

```bash
$ npm install @nestjs/jwt passport passport-jwt bcrypt
$ npm install @types/passport-jwt @types/bcrypt -D
```

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { ROUTES } from '@/shared/constants/routes.enum';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(ROUTES.POSTS)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @AuthUser() user: User) {
    return this.postService.createPost(createPostDto, user.id);
  }

  @Get()
  async findAll(@AuthUser() user: User) {
    return this.postService.getAllPosts(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: User) {
    return this.postService.getPostById(id, user.id);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @AuthUser() user: User,
  ) {
    return this.postService.updatePost(id, updatePostDto, user.id);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.postService.deletePost(id, user.id);
  }
}

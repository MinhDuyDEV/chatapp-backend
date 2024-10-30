import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@/entities/user.entity';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@AuthUser() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postService.create({ userId: user.id, ...createPostDto });
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':postId')
  findOne(@Param('id') postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch(':postId')
  update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  remove(@Param('postId') postId: string) {
    return this.postService.remove(postId);
  }

  @Post('/:postId/like')
  like(@Param('id') postId: string, @AuthUser() user: User) {
    return this.postService.like({ postId, userId: user.id });
  }

  @Delete('/:postId/like')
  unlike(@Param('postId') postId: string, @AuthUser() user: User) {
    return this.postService.unlike({ postId, userId: user.id });
  }

  @Get('/:postId/comments')
  getComments(@Param('postId') postId: string) {
    return this.postService.getComments(postId);
  }

  @Delete('/:postId/comments/:commentId')
  deleteComment(
    @AuthUser() user: User,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.postService.deleteComment({
      userId: user.id,
      postId,
      commentId,
    });
  }
}

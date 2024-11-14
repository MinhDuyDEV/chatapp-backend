import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAccessTokenGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @AuthUser() user: User,
  ) {
    const { content, parentCommentId } = createCommentDto;
    return this.commentService.createComment({
      postId,
      userId: user.id,
      content,
      parentCommentId,
    });
  }

  @Get('post/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query('parentCommentId') parentCommentId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return this.commentService.getCommentsByParentId({
      postId,
      parentCommentId,
      page,
      limit,
    });
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Query('postId') postId: string,
  ) {
    return this.commentService.deleteComment({
      commentId,
      postId,
    });
  }
}

import { Comment } from '@/entities/comment.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { CommentResponseDto } from './dto/comment-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserBasicInfoDto } from '../user/dto/user-basic-info.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private mapCommentToResponseDto(comment: Comment): CommentResponseDto {
    return plainToInstance(
      CommentResponseDto,
      {
        ...comment,
        postId: comment.post.id,
        user: plainToInstance(UserBasicInfoDto, comment.user, {
          excludeExtraneousValues: true,
        }),
        parentCommentId: comment.parent ? comment.parent.id : null,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async createComment({
    postId,
    userId,
    content,
    parentCommentId = null,
  }: {
    postId: string;
    userId: string;
    content: string;
    parentCommentId?: string | null;
  }): Promise<CommentResponseDto> {
    const post = await this.postRepository.findOneByOrFail({ id: postId });
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const comment = new Comment();
    comment.post = post;
    comment.user = user;
    comment.content = content;
    comment.parent = parentCommentId
      ? await this.commentRepository.findOneBy({ id: parentCommentId })
      : null;

    let rightValue: number;

    if (comment.parent) {
      rightValue = comment.parent.right;

      // Update right value of all comments that have right value greater than or equal to the right value of the parent comment
      await this.commentRepository
        .createQueryBuilder()
        .update(Comment)
        .set({ right: () => 'right + 2' })
        .where('postId = :postId AND right >= :rightValue', {
          postId,
          rightValue,
        })
        .execute();

      // Update left value of all comments that have left value greater than the right value of the parent comment
      await this.commentRepository
        .createQueryBuilder()
        .update(Comment)
        .set({ left: () => 'left + 2' })
        .where('postId = :postId AND left > :rightValue', {
          postId,
          rightValue,
        })
        .execute();
    } else {
      const maxRightValue = await this.commentRepository
        .createQueryBuilder('comment')
        .select('MAX(comment.right)', 'max')
        .where('comment.postId = :postId', { postId })
        .getRawOne();

      rightValue = maxRightValue ? maxRightValue.max + 1 : 1;
    }

    comment.left = rightValue;
    comment.right = rightValue + 1;

    const savedComment = await this.commentRepository.save(comment);

    return this.mapCommentToResponseDto(savedComment);
  }

  async getCommentsByParentId({
    postId,
    parentCommentId = null,
    page,
    limit,
  }: {
    postId: string;
    parentCommentId?: string | null;
    page?: number;
    limit?: number;
  }) {
    await this.postRepository.findOneByOrFail({ id: postId });

    if (parentCommentId) {
      const parent = await this.commentRepository.findOneBy({
        id: parentCommentId,
      });
      if (!parent) throw new NotFoundException('Parent comment not found');

      const [comments, total] = await this.commentRepository.findAndCount({
        where: {
          post: { id: postId },
          left: MoreThan(parent.left),
          right: LessThan(parent.right),
        },
        relations: ['user', 'post', 'parent'],
        order: { left: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: comments.map((comment) => this.mapCommentToResponseDto(comment)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { post: { id: postId } },
      relations: ['user', 'post', 'parent'],
      order: { left: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: comments.map((comment) => this.mapCommentToResponseDto(comment)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteComment({
    commentId,
    postId,
  }: {
    commentId: string;
    postId: string;
  }): Promise<boolean> {
    await this.postRepository.findOneByOrFail({ id: postId });
    const comment = await this.commentRepository.findOneByOrFail({
      id: commentId,
    });

    const leftValue = comment.left;
    const rightValue = comment.right;
    const width = rightValue - leftValue + 1;

    await this.commentRepository.delete({
      post: { id: postId },
      left: Between(leftValue, rightValue),
    });

    // Update left value of all comments that have left value greater than the right value of the deleted comment
    await this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({ left: () => `left - ${width}` })
      .where('postId = :postId AND left > :rightValue', { postId, rightValue })
      .execute();

    // Update right value of all comments that have right value greater than the right value of the deleted comment
    await this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({ right: () => `right - ${width}` })
      .where('postId = :postId AND right > :rightValue', { postId, rightValue })
      .execute();

    return true;
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Like } from '@/entities/like.entity';
import { Post } from '@/entities/post.entity';
import { Comment } from '@/entities/comment.entity';

import { UpdatePostDto } from './dto/update-post.dto';
import { LikePostParams } from './types/like-post-params.type';
import { CreatePostParams } from './types/create-post-params.type';
import { DeleteCommentParams } from './types/delete-comment-params';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createPostParams: CreatePostParams): Promise<Post> {
    const { userId, content } = createPostParams;
    const post = this.postRepository.create({
      author: { id: userId },
      content,
    });
    return await this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.postRepository.remove(post);
  }

  async like({ postId, userId }: LikePostParams) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const like = this.likeRepository.create({
      post: { id: postId },
      user: { id: userId },
    });

    return await this.likeRepository.save(like);
  }

  async unlike({ postId, userId }: LikePostParams) {
    const like = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    return await this.likeRepository.remove(like);
  }

  async getComments(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post.comments;
  }

  async deleteComment({ userId, commentId, postId }: DeleteCommentParams) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, post: { id: postId }, author: { id: userId } },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
    return await this.commentRepository.remove(comment);
  }
}

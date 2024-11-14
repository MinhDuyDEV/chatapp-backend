import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { In, Repository } from 'typeorm';
import { File } from '@/entities/file.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToInstance } from 'class-transformer';
import { Comment } from '@/entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private mapPostToResponseDto(
    post: Post,
    currentUserId: string,
  ): PostResponseDto {
    const postResponse = plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });

    if (post.likes && post.likes.length > 0) {
      const [firstLike, ...remainingLikes] = post.likes;
      postResponse.likes = [
        {
          username: firstLike.user.username,
        },
      ];
      postResponse.remainingLikeCount = remainingLikes.length;
      postResponse.isLikedByCurrentUser = post.likes.some(
        (like) => like.user.id === currentUserId,
      );
    } else {
      postResponse.likes = [];
      postResponse.remainingLikeCount = 0;
      postResponse.isLikedByCurrentUser = false;
    }

    return postResponse;
  }

  // Create a new post
  async createPost(
    createPostDto: CreatePostDto,
    authorId: string,
  ): Promise<PostResponseDto> {
    const post = this.postRepository.create({
      ...createPostDto,
      author: { id: authorId },
    });
    const savedPost = await this.postRepository.save(post);

    if (createPostDto.fileIds?.length > 0) {
      const files = await this.fileRepository.findBy({
        id: In(createPostDto.fileIds),
      });
      files.forEach((file) => (file.post = savedPost));
      await this.fileRepository.save(files);
    }

    return this.getPostById(savedPost.id, authorId);
  }

  async getAllPosts(currentUserId: string, page: number, limit: number) {
    const [posts, total] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.files', 'file')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await this.commentRepository.count({
          where: { post: { id: post.id } },
        });
        return {
          ...post,
          commentCount,
        };
      }),
    );

    return {
      data: postsWithCommentCount.map((post) =>
        this.mapPostToResponseDto(post, currentUserId),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostById(
    id: string,
    currentUserId: string,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.files', 'file')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) throw new NotFoundException('Post not found');

    return this.mapPostToResponseDto(post, currentUserId);
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    authorId: string,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id, author: { id: authorId } },
    });
    if (!post) throw new NotFoundException('Post not found or unauthorized');

    Object.assign(post, updatePostDto);
    const updatedPost = await this.postRepository.save(post);

    return this.mapPostToResponseDto(updatedPost, authorId);
  }

  // Delete a post by ID
  async deletePost(
    id: string,
    authorId: string,
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.postRepository.delete({
      id,
      author: { id: authorId },
    });
    if (result.affected === 0)
      throw new NotFoundException('Post not found or unauthorized');

    return { success: true, message: 'Post has been deleted successfully' };
  }
}

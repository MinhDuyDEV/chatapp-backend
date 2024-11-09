import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { In, Repository } from 'typeorm';
import { File } from '@/entities/file.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  // Create a new post
  async create(
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

    return await this.getPost(savedPost.id);
  }

  // Get all posts
  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.files', 'file')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    const postResponses = posts.map((post) => {
      const postResponse = plainToInstance(PostResponseDto, post, {
        excludeExtraneousValues: true,
      });

      postResponse.likes = post.likes.map((like) => ({
        id: like.id,
        userId: like.user.id,
        username: like.user.username,
        updatedAt: like.updatedAt,
      }));

      return postResponse;
    });

    return postResponses;
  }

  // Get a single post by id
  async getPost(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.files', 'file')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .where('post.id = :id', { id })
      .getOne();
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    const postResponse = plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });

    postResponse.likes = post.likes.map((like) => ({
      id: like.id,
      userId: like.user.id,
      username: like.user.username,
      updatedAt: like.updatedAt,
    }));

    return postResponse;
  }

  // Update an existing post
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    authorId: string,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: {
        id,
        author: { id: authorId },
      },
    });
    if (!post) {
      throw new NotFoundException(
        `Post not found or you don't have permission to update it`,
      );
    }

    // Apply updates from UpdatePostDto into the found post
    Object.assign(post, updatePostDto);

    const updatedPost = await this.postRepository.save(post);

    return plainToInstance(PostResponseDto, updatedPost, {
      excludeExtraneousValues: true,
    });
  }

  // Delete a post by ID
  async remove(
    id: string,
    authorId: string,
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.postRepository.delete({
      id,
      author: { id: authorId },
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Post not found or you don't have permission to delete it`,
      );
    }
    return {
      success: true,
      message: `Post has been deleted successfully`,
    };
  }
}

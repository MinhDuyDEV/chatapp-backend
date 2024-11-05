import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  // Create a new post
  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      author: { id: authorId },
    });
    return this.postRepository.save(post);
  }

  // Get all posts
  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get a single post by id
  async getPost(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    return post;
  }

  // Update an existing post
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    authorId: string,
  ): Promise<Post> {
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

    return this.postRepository.save(post);
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

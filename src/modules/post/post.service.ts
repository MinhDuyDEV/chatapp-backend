import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { In, Repository } from 'typeorm';
import { File } from '@/entities/file.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToInstance } from 'class-transformer';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly cacheService: CacheService,
  ) {}

  // Helper to map Post entity to PostResponseDto
  private mapPostToResponseDto(post: Post): PostResponseDto {
    const postResponse = plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
    postResponse.likes = post.likes?.map((like) => ({
      id: like.id,
      userId: like.user.id,
      username: like.user.username,
      updatedAt: like.updatedAt,
    }));
    return postResponse;
  }

  // Cache helper function
  private async setPostsCache(
    key: string,
    posts: PostResponseDto[],
    ttl = 3600 * 1000,
  ) {
    await this.cacheService.set<PostResponseDto[]>(key, posts, ttl); // Cache for 1 hour
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

    await this.cacheAllPosts({ userId: authorId });
    return this.getPostById(savedPost.id);
  }

  // Fetch all posts from database and cache them
  async cacheAllPosts({ userId }: { userId: string }): Promise<void> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.files', 'file')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    const postResponses = posts.map(this.mapPostToResponseDto);
    await this.setPostsCache(`posts:${userId}`, postResponses);
  }

  // Retrieve all posts (from cache if available)
  async getAllPosts({
    userId,
  }: {
    userId: string;
  }): Promise<PostResponseDto[]> {
    const cachedPosts = await this.cacheService.get<PostResponseDto[]>(
      `posts:${userId}`,
    );
    if (cachedPosts) return cachedPosts;

    await this.cacheAllPosts({ userId });
    return await this.cacheService.get<PostResponseDto[]>(`posts:${userId}`);
  }

  // Retrieve a single post by ID (from cache if available)
  async getPostById(id: string): Promise<PostResponseDto> {
    const cacheKey = `post:${id}`;
    const cachedPost = await this.cacheService.get<PostResponseDto>(cacheKey);
    if (cachedPost) return cachedPost;

    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.files', 'file')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) throw new NotFoundException('Post not found');

    const postResponse = this.mapPostToResponseDto(post);
    await this.cacheService.set(cacheKey, postResponse, 3600 * 1000); // Cache for 1 hour
    return postResponse;
  }

  // Update an existing post
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

    await this.cacheService.delete(`post:${id}`);
    await this.cacheService.delete(`posts:${authorId}`);

    return this.mapPostToResponseDto(updatedPost);
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

    await this.cacheService.delete(`post:${id}`);
    await this.cacheService.delete(`posts:${authorId}`);

    return { success: true, message: 'Post has been deleted successfully' };
  }
}

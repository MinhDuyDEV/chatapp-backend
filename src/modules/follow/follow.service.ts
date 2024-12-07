import { Follow } from '@/entities/follow.entity';
import { User } from '@/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DtoHelper } from '@/shared/utils/dto-helper';
import { UserBasicInfoDto } from '../user/dto/user-basic-info.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('Users cannot follow themselves');
    }

    const [follower, userFollowing] = await Promise.all([
      this.userRepo.findOneBy({ id: followerId }),
      this.userRepo.findOneBy({ id: followingId }),
    ]);
    if (!follower || !userFollowing) {
      throw new BadRequestException('User not found');
    }

    const existingFollow = await this.followRepo.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    const follow = this.followRepo.create({
      follower: { id: followerId },
      following: { id: followingId },
    });

    await this.followRepo.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('Users cannot unfollow themselves');
    }

    const follow = await this.followRepo.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (!follow) {
      throw new BadRequestException('Not following this user');
    }

    await this.followRepo.remove(follow);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepo.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    return !!follow;
  }

  async getFollowers(userId: string): Promise<UserBasicInfoDto[]> {
    const follows = await this.followRepo.find({
      where: { following: { id: userId } },
      relations: ['follower', 'follower.profile'],
      relationLoadStrategy: 'join',
      select: {
        follower: {
          id: true,
          username: true,
          avatar: true,
          profile: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return DtoHelper.mapToDtoArray(
      UserBasicInfoDto,
      follows.map((follow) => follow.follower),
    );
  }

  async getFollowing(userId: string): Promise<UserBasicInfoDto[]> {
    const follows = await this.followRepo.find({
      where: { follower: { id: userId } },
      relations: ['following', 'following.profile'],
      relationLoadStrategy: 'join',
      select: {
        following: {
          id: true,
          username: true,
          avatar: true,
          profile: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return DtoHelper.mapToDtoArray(
      UserBasicInfoDto,
      follows.map((follow) => follow.following),
    );
  }

  async countFollowers(userId: string): Promise<number> {
    return await this.followRepo.count({
      where: { following: { id: userId } },
    });
  }

  async countFollowing(userId: string): Promise<number> {
    return await this.followRepo.count({
      where: { follower: { id: userId } },
    });
  }
}

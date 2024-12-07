import { FriendRequest } from '@/entities/friend-request.entity';
import { DtoHelper } from '@/shared/utils/dto-helper';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AcceptFriendRequestResponseDto,
  FriendRequestDto,
  RejectFriendRequestResponseDto,
  SendFriendRequestResponseDto,
} from './dto/friend.dto';
import { UserBasicInfoDto } from '../user/dto/user-basic-info.dto';
import { User } from '@/entities/user.entity';
import { FollowService } from '../follow/follow.service';
import { Services } from '@/shared/constants/services.enum';
import {
  FriendRequestStatus,
  UserRelationship,
} from './types/user-relationship.type';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(Services.FOLLOW_SERVICE)
    private readonly followService: FollowService,
  ) {}

  async getFriends(userId: string) {
    await this.userRepo.findOneOrFail({ where: { id: userId } });

    const acceptedRequests = await this.friendRequestRepo.find({
      where: [
        { sender: { id: userId }, status: FriendRequestStatus.ACCEPTED },
        { receiver: { id: userId }, status: FriendRequestStatus.ACCEPTED },
      ],
      relations: ['sender', 'receiver', 'sender.profile', 'receiver.profile'],
      relationLoadStrategy: 'join',
      select: {
        id: true,
        sender: {
          id: true,
          username: true,
          avatar: true,
          profile: {
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
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

    const friends = acceptedRequests.map((request) => {
      return request.sender.id === userId ? request.receiver : request.sender;
    });

    return DtoHelper.mapToDtoArray(UserBasicInfoDto, friends);
  }

  async getMutualFriends(userId: string, otherUserId: string) {
    const [user, otherUser] = await Promise.all([
      this.userRepo.findOneBy({ id: userId }),
      this.userRepo.findOneBy({ id: otherUserId }),
    ]);
    if (!user || !otherUser) {
      throw new BadRequestException('User not found');
    }

    // Get friends of both users
    const [userFriends, otherUserFriends] = await Promise.all([
      this.getFriends(userId),
      this.getFriends(otherUserId),
    ]);

    const mutualFriends = userFriends.filter((friend1) =>
      otherUserFriends.some((friend2) => friend2.id === friend1.id),
    );

    return mutualFriends;
  }

  async countFriends(userId: string): Promise<number> {
    await this.userRepo.findOneOrFail({ where: { id: userId } });

    return await this.friendRequestRepo.count({
      where: [
        { sender: { id: userId }, status: FriendRequestStatus.ACCEPTED },
        { receiver: { id: userId }, status: FriendRequestStatus.ACCEPTED },
      ],
    });
  }

  async sendFriendRequest(
    senderId: string,
    receiverId: string,
    message?: string,
  ): Promise<SendFriendRequestResponseDto> {
    await Promise.all([
      this.userRepo.findOneOrFail({ where: { id: senderId } }),
      this.userRepo.findOneOrFail({ where: { id: receiverId } }),
    ]);

    const existingRequest = await this.friendRequestRepo.findOne({
      where: [
        {
          sender: { id: senderId },
          receiver: { id: receiverId },
          status: FriendRequestStatus.PENDING,
        },
        {
          sender: { id: receiverId },
          receiver: { id: senderId },
          status: FriendRequestStatus.PENDING,
        },
      ],
      relations: ['sender', 'receiver', 'sender.profile'],
      relationLoadStrategy: 'join',
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        message: true,
        sender: {
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

    if (existingRequest) {
      if (existingRequest.sender.id === receiverId) {
        throw new BadRequestException(
          'The user you want to send a request to has already sent you a friend request',
        );
      }

      existingRequest.updatedAt = new Date();
      if (message) {
        existingRequest.message = message;
      }
      await this.friendRequestRepo.save(existingRequest);

      return DtoHelper.mapToDto(SendFriendRequestResponseDto, existingRequest);
    }

    const request = this.friendRequestRepo.create({
      sender: { id: senderId },
      receiver: { id: receiverId },
      message,
      status: FriendRequestStatus.PENDING,
    });
    await this.friendRequestRepo.save(request);

    // Auto-follow when sending friend request
    try {
      await this.followService.followUser(senderId, receiverId);
    } catch (error) {
      // If already following, ignore the error
      if (
        !(
          error instanceof BadRequestException &&
          error.message === 'Already following this user'
        )
      ) {
        throw error;
      }
    }

    const senderInfo = await this.friendRequestRepo.findOne({
      where: { id: request.id },
      relations: ['sender', 'sender.profile'],
      relationLoadStrategy: 'join',
      select: {
        id: true,
        status: true,
        message: true,
        updatedAt: true,
        sender: {
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

    return DtoHelper.mapToDto(SendFriendRequestResponseDto, senderInfo);
  }

  async acceptFriendRequest(userId: string, requestId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const request = await this.friendRequestRepo.findOne({
      where: {
        id: requestId,
        receiver: { id: userId },
        status: FriendRequestStatus.PENDING,
      },
      relations: ['sender', 'receiver'],
    });

    if (!request) {
      throw new BadRequestException('Friend request not found');
    }

    request.status = FriendRequestStatus.ACCEPTED;
    request.respondedAt = new Date();
    await this.friendRequestRepo.save(request);

    // Receiver follows sender when accepting friend request
    try {
      await this.followService.followUser(
        request.receiver.id,
        request.sender.id,
      );
    } catch (error) {
      // Ignore if already following
      if (
        !(
          error instanceof BadRequestException &&
          error.message === 'Already following this user'
        )
      ) {
        throw error;
      }
    }

    return DtoHelper.mapToDto(AcceptFriendRequestResponseDto, request);
  }

  async cancelFriendRequest(userId: string, requestId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const request = await this.friendRequestRepo.findOneBy({
      id: requestId,
      sender: { id: userId },
      status: FriendRequestStatus.PENDING,
    });
    if (!request) {
      throw new BadRequestException('Friend request not found');
    }

    await this.friendRequestRepo.remove(request);

    return {
      message: 'Friend request cancelled successfully',
    };
  }

  async rejectFriendRequest(
    userId: string,
    requestId: string,
    reason?: string,
  ) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const request = await this.friendRequestRepo.findOneBy({
      id: requestId,
      receiver: { id: userId },
    });
    if (!request) {
      throw new BadRequestException('Friend request not found');
    }
    request.status = FriendRequestStatus.REJECTED;
    request.reason = reason;
    request.respondedAt = new Date();
    await this.friendRequestRepo.save(request);

    return DtoHelper.mapToDto(RejectFriendRequestResponseDto, request);
  }

  async getSentFriendRequests(userId: string) {
    const requests = await this.friendRequestRepo.find({
      where: {
        sender: { id: userId },
        status: FriendRequestStatus.PENDING,
      },
      relations: ['receiver', 'receiver.profile'],
      relationLoadStrategy: 'join',
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        receiver: {
          id: true,
          username: true,
          avatar: true,
          profile: {
            firstName: true,
            lastName: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });

    return DtoHelper.mapToDtoArray(FriendRequestDto, requests);
  }

  async getReceivedFriendRequests(userId: string) {
    const requests = await this.friendRequestRepo.find({
      where: {
        receiver: { id: userId },
        status: FriendRequestStatus.PENDING,
      },
      relations: ['sender', 'sender.profile'],
      relationLoadStrategy: 'join',
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        sender: {
          id: true,
          username: true,
          avatar: true,
          profile: {
            firstName: true,
            lastName: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });

    return DtoHelper.mapToDtoArray(FriendRequestDto, requests);
  }

  async getRelationship(
    userId: string,
    targetUserId: string,
  ): Promise<UserRelationship> {
    const [isFollowing, friendRequest] = await Promise.all([
      this.followService.isFollowing(userId, targetUserId),
      this.friendRequestRepo.findOne({
        where: [
          { sender: { id: userId }, receiver: { id: targetUserId } },
          { sender: { id: targetUserId }, receiver: { id: userId } },
        ],
        relations: ['sender', 'receiver'],
        order: { createdAt: 'DESC' },
      }),
    ]);
    if (!friendRequest) {
      return {
        requestId: '',
        isFollowing,
        isFriend: false,
        hasPendingFriendRequest: false,
        friendRequestStatus: FriendRequestStatus.NONE,
      };
    }

    const relationship: UserRelationship = {
      requestId: friendRequest.id,
      isFollowing,
      isFriend: false,
      hasPendingFriendRequest: false,
      friendRequestStatus: FriendRequestStatus.NONE,
    };

    if (friendRequest) {
      relationship.friendRequestStatus = friendRequest.status;

      switch (friendRequest.status) {
        case FriendRequestStatus.ACCEPTED:
          relationship.isFriend = true;
          break;
        case FriendRequestStatus.PENDING:
          relationship.hasPendingFriendRequest = true;
          relationship.pendingFriendRequestType =
            friendRequest.sender.id === userId ? 'sent' : 'received';
          break;
        case FriendRequestStatus.REJECTED:
        case FriendRequestStatus.NONE:
        default:
          // No need to handle because the default values are already set
          break;
      }
    }

    return relationship;
  }

  async cancelFriend(userId: string, targetUserId: string) {
    await this.userRepo.findOneOrFail({ where: { id: userId } });

    // Find accepted friend request between two users
    const friendRequest = await this.friendRequestRepo.findOne({
      where: [
        {
          sender: { id: userId },
          receiver: { id: targetUserId },
          status: FriendRequestStatus.ACCEPTED,
        },
        {
          sender: { id: targetUserId },
          receiver: { id: userId },
          status: FriendRequestStatus.ACCEPTED,
        },
      ],
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest) {
      throw new BadRequestException('Friend relationship not found');
    }

    await this.friendRequestRepo.remove(friendRequest);

    // Auto unfollow if following
    try {
      const isFollowing = await this.followService.isFollowing(
        userId,
        targetUserId,
      );
      if (isFollowing) {
        await this.followService.unfollowUser(userId, targetUserId);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return {
      message: 'Friend relationship cancelled successfully',
    };
  }
}

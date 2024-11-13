import { User } from '@/entities/user.entity';
import { FindUserParams } from '@/modules/user/types/find-user-params.type';
import { CreateUserParams } from '@/modules/user/types/create-user.type';

export interface IUserService {
  findAllUsers(): Promise<User[]>;
  findUser(params: FindUserParams): Promise<User>;
  saveRefreshToken(token: string, userId: string): Promise<any>;
  createUser(params: CreateUserParams): Promise<User>;
  deleteRefreshToken(userId: string): Promise<any>;
}

import { Inject, Injectable } from '@nestjs/common';
import Keyv from 'keyv';

@Injectable()
export class CacheService {
  constructor(@Inject('KEYV_INSTANCE') private readonly keyv: Keyv) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.keyv.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.keyv.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.keyv.delete(key);
  }
}

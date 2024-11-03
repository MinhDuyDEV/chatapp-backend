import { Message } from '@/entities/message.entity';

export interface ServerToClientEvents {
  newMessage: (payload: Message) => void;
}

import { plainToInstance } from 'class-transformer';

import { User } from '@/entities/user.entity';
import { Message } from '@/entities/message.entity';
import { Conversation } from '@/entities/conversation.entity';
import { UserResponse } from '@/modules/user/dto/user-response.dto';
import { MessageResponse } from '@/modules/message/dto/message-response.dto';
import { ConversationResponse } from '@/modules/conversation/dto/conversation-response.dto';
import { LastMessageSentResponse } from '@/modules/message/dto/last-message-sent-response.dto';

export function transformConversationResponse(
  conversation: Conversation,
): ConversationResponse {
  return plainToInstance(
    ConversationResponse,
    {
      id: conversation.id,
      createdAt: conversation.createdAt,
      lastMessageSent: plainToInstance(
        LastMessageSentResponse,
        conversation.lastMessageSent,
        {
          excludeExtraneousValues: true,
        },
      ),
      creator: plainToInstance(UserResponse, conversation.creator, {
        excludeExtraneousValues: true,
      }),
      recipient: plainToInstance(UserResponse, conversation.recipient, {
        excludeExtraneousValues: true,
      }),
    },
    { excludeExtraneousValues: true },
  );
}

export function transformCreateMessageResponse(
  message: Message,
): MessageResponse {
  return plainToInstance(
    MessageResponse,
    {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      author: transformUserResponse(message.author),
      conversation: transformConversationResponse(message.conversation),
    },
    { excludeExtraneousValues: true },
  );
}

export function transformGetMessagesResponse(
  messages: Message[],
): MessageResponse[] {
  return plainToInstance(
    MessageResponse,
    messages.map((message) => ({
      id: message.id,
      content: message.content,
      author: transformUserResponse(message.author),
      createdAt: message.createdAt,
    })),
  );
}

export function transformUserResponse(user: User): UserResponse {
  return plainToInstance(UserResponse, user, {
    excludeExtraneousValues: true,
  });
}

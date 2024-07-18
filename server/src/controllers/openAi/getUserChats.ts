import { protectedProcedure } from '../../trpc';
import { getUserChatsService } from '../../services/openAi/openAi.service';
import { z } from 'zod';

export const getUserChats = async (c) => {
  try {
    const { userId, itemTypeId } = await c.req.parseBody();
    const conversations = getUserChatsService(userId, itemTypeId);
    return c.json({ conversations });
  } catch (error) {
    return c.json({ error: `Failed to get user chats: ${error.message}` }, 500);
  }
};

export function getUserChatsRoute() {
  return protectedProcedure
    .input(z.object({ userId: z.string(), itemTypeId: z.string() }))
    .query(async (opts) => {
      const { userId, itemTypeId } = opts.input;
      return getUserChatsService(userId, itemTypeId);
    });
}

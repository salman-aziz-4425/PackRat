import { duplicatePublicPackService } from '../../services/pack/pack.service';
import * as validator from '@packrat/validations';
import { publicProcedure, protectedProcedure } from '../../trpc';

/**
 * Duplicates a public pack.
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise} - a promise that resolves with the duplicated pack
 */
export const duplicatePublicPack = async (c) => {
  try {
    const { packId, ownerId, items } = await c.req.parseBody();
    const result = await duplicatePublicPackService(packId, ownerId, items);
    return c.json({ result }, 200);
  } catch (error) {
    return c.json(
      { error: `Failed to duplicate public pack: ${error.message}` },
      500,
    );
  }
};

export function duplicatePublicPackRoute() {
  return protectedProcedure
    .input(validator.duplicatePublicPack)
    .mutation(async (opts) => {
      const { packId, ownerId, items } = opts.input;
      const result = await duplicatePublicPackService(packId, ownerId, items);
      return result;
    });
}

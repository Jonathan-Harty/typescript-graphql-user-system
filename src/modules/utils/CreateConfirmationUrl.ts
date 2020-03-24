import { confirmUserPrefix } from './../constants/redisPrefixes';
import { redis } from '../../redis';
import { v4 } from 'uuid';

export const createConfirmationUrl = async (
  userId: number
): Promise<string> => {
  const token = v4();
  await redis.set(confirmUserPrefix + token, userId, 'ex', 60 * 60 * 24);

  return `http://localhost:3000/user/confirm/${token}`;
};

import { User } from '../../entity/User';
import { redis } from '../../redis';
import { MyContext } from '../../types/MyContext';
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg('token') token: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) {
      return false;
    }

    await User.update({ id: +userId }, { confirmed: true });

    await redis.del(token);

    return true;
  }
}

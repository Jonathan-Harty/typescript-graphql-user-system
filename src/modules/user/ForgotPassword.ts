import { forgotPasswordPrefix } from './../constants/redisPrefixes';
import { sendEmail } from './../utils/SendEmail';
import { v4 } from 'uuid';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { MyContext } from '../../types/MyContext';
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await User.findOne({ where: email });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24);

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}

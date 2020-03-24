import { createConfirmationUrl } from '../utils/CreateConfirmationUrl';
import { isAuth } from './../middleware/isAuth';
import { RegisterInput } from './register/RegisterInput';
import { User } from './../../entity/User';
import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/SendEmail';

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async query(): Promise<string> {
    return 'query';
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { firstName, lastName, password, email }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      email,
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }
}

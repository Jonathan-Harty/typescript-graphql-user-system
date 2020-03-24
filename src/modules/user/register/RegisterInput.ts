import { PasswordMixin } from './../../shared/PasswordInput';
import { InputType, Field } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { isEmailAlreadyInUse } from './isEmailAlreadyInUse';

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyInUse({ message: 'email already in use' })
  email: string;
}

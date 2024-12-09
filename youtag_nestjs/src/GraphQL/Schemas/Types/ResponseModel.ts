import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponseModel<T> {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => String)
  data: T;
}

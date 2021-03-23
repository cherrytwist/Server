import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { ContextInput } from '@domain/context/context/context.dto';
import { SMALL_TEXT_LENGTH, TINY_TEXT_LENGTH } from '@src/common/constants';
import {
  IsUniqueTextId,
  TextIdType,
} from '@src/core/validation/constraints/unique.text.id';

@InputType()
export class ChallengeInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(SMALL_TEXT_LENGTH)
  name!: string;

  @Field({ nullable: true })
  @IsUniqueTextId(TextIdType.challenge, {
    message: 'Challenge with the textID: $value already exists!',
  })
  @IsOptional()
  @MaxLength(TINY_TEXT_LENGTH)
  textID!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(SMALL_TEXT_LENGTH)
  state?: string;

  @Field(() => ContextInput, { nullable: true })
  @IsOptional()
  context?: ContextInput;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[];
}
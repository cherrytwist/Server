import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { ReferenceInput } from '@domain/common/reference/reference.dto';
import { TagsetInput } from '@domain/common/tagset/tagset.dto';
import { MID_TEXT_LENGTH, LONG_TEXT_LENGTH } from '@src/common/constants';

@InputType()
export class ProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(MID_TEXT_LENGTH)
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(LONG_TEXT_LENGTH)
  description?: string;

  @Field(() => [TagsetInput], { nullable: true })
  @IsOptional()
  tagsetsData?: TagsetInput[];

  @Field(() => [ReferenceInput], { nullable: true })
  @IsOptional()
  referencesData?: ReferenceInput[];
}
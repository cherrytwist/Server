import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from '@common/decorators/roles.decorator';
import { GqlAuthGuard } from '@src/core/authorization/graphql.guard';
import { TagsetService } from './tagset.service';
import { Profiling } from '@src/common/decorators';
import { AuthorizationRoles } from '@src/core/authorization/authorization.roles';
import { UpdateTagsetInput, Tagset, ITagset } from '@domain/common/tagset';

@Resolver(() => Tagset)
export class TagsetResolver {
  constructor(private tagsetService: TagsetService) {}

  @Roles(AuthorizationRoles.CommunityAdmins, AuthorizationRoles.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Tagset, {
    description: 'Updates the Tagset.',
  })
  @Profiling.api
  async updateTagset(
    @Args('tagsetData') tagsetData: UpdateTagsetInput
  ): Promise<ITagset> {
    return await this.tagsetService.updateTagset(tagsetData);
  }
}
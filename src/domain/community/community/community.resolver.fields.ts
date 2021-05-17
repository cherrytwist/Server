import { AuthorizationRoleGlobal } from '@common/enums';
import {
  AuthorizationCommunityMember,
  GraphqlGuard,
} from '@core/authorization';
import { Application } from '@domain/community/application/application.entity';
import { UserGroup } from '@domain/community/user-group/user-group.entity';
import { User } from '@domain/community/user/user.entity';
import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGlobalRoles, Profiling } from '@src/common/decorators';
import { Community } from './community.entity';
import { CommunityService } from './community.service';

@Resolver(() => Community)
export class CommunityResolverFields {
  constructor(private communityService: CommunityService) {}

  @AuthorizationGlobalRoles(
    AuthorizationRoleGlobal.Admin,
    AuthorizationRoleGlobal.CommunityAdmin
  )
  @AuthorizationCommunityMember()
  @UseGuards(GraphqlGuard)
  @ResolveField('groups', () => [UserGroup], {
    nullable: true,
    description: 'Groups of users related to a Community.',
  })
  @Profiling.api
  async groups(@Parent() community: Community) {
    return await this.communityService.loadGroups(community);
  }

  @AuthorizationGlobalRoles(
    AuthorizationRoleGlobal.Admin,
    AuthorizationRoleGlobal.CommunityAdmin
  )
  @AuthorizationCommunityMember()
  @UseGuards(GraphqlGuard)
  @ResolveField('members', () => [User], {
    nullable: true,
    description: 'All users that are contributing to this Community.',
  })
  @Profiling.api
  async members(@Parent() community: Community) {
    return await this.communityService.getMembers(community);
  }

  @AuthorizationGlobalRoles(
    AuthorizationRoleGlobal.Admin,
    AuthorizationRoleGlobal.CommunityAdmin
  )
  @AuthorizationCommunityMember()
  @UseGuards(GraphqlGuard)
  @ResolveField('applications', () => [Application], {
    nullable: false,
    description: 'Application available for this community.',
  })
  @Profiling.api
  async applications(@Parent() community: Community) {
    const apps = await this.communityService.getApplications(community);
    return apps || [];
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationEngineService } from '@src/services/authorization-engine/authorization-engine.service';
import { CommunityService } from './community.service';
import { Community, ICommunity } from '@domain/community/community';

@Injectable()
export class CommunityAuthorizationService {
  constructor(
    private communityService: CommunityService,
    private authorizationEngine: AuthorizationEngineService,
    @InjectRepository(Community)
    private communityRepository: Repository<Community>
  ) {}

  async applyAuthorizationRules(community: ICommunity): Promise<ICommunity> {
    // cascade
    const groups = await this.communityService.getUserGroups(community);
    for (const group of groups) {
      group.authorization = await this.authorizationEngine.inheritParentAuthorization(
        group.authorization,
        community.authorization
      );
    }

    const applications = await this.communityService.getApplications(community);
    for (const application of applications) {
      application.authorization = await this.authorizationEngine.inheritParentAuthorization(
        application.authorization,
        community.authorization
      );
    }

    return await this.communityRepository.save(community);
  }
}
import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { Args, Mutation } from '@nestjs/graphql';
import { ChallengeService } from './challenge.service';
import { CurrentUser, Profiling } from '@src/common/decorators';
import {
  ChallengeEventInput,
  DeleteChallengeInput,
  CreateChallengeInput,
  UpdateChallengeInput,
} from '@domain/challenge/challenge';
import {
  ChallengeAuthorizeStateModificationInput,
  GraphqlGuard,
} from '@core/authorization';
import {
  CreateOpportunityInput,
  IOpportunity,
} from '@domain/collaboration/opportunity';
import { AuthorizationPrivilege } from '@common/enums';
import { ChallengeLifecycleOptionsProvider } from './challenge.lifecycle.options.provider';
import { AgentInfo } from '@core/authentication';
import { AuthorizationEngineService } from '@src/services/platform/authorization-engine/authorization-engine.service';
import { ChallengeAuthorizationService } from '@domain/challenge/challenge/challenge.service.authorization';
import { OpportunityAuthorizationService } from '@domain/collaboration/opportunity/opportunity.service.authorization';
import { IChallenge } from './challenge.interface';
import { IUser } from '@domain/community/user/user.interface';

@Resolver()
export class ChallengeResolverMutations {
  constructor(
    private opportunityAuthorizationService: OpportunityAuthorizationService,
    private challengeAuthorizationService: ChallengeAuthorizationService,
    private authorizationEngine: AuthorizationEngineService,
    private challengeService: ChallengeService,
    private challengeLifecycleOptionsProvider: ChallengeLifecycleOptionsProvider
  ) {}

  @UseGuards(GraphqlGuard)
  @Mutation(() => IChallenge, {
    description: 'Creates a new child challenge within the parent Challenge.',
  })
  @Profiling.api
  async createChildChallenge(
    @CurrentUser() agentInfo: AgentInfo,
    @Args('challengeData') challengeData: CreateChallengeInput
  ): Promise<IChallenge> {
    const challenge = await this.challengeService.getChallengeOrFail(
      challengeData.parentID
    );
    await this.authorizationEngine.grantAccessOrFail(
      agentInfo,
      challenge.authorization,
      AuthorizationPrivilege.CREATE,
      `challengeCreate: ${challenge.nameID}`
    );
    const childChallenge = await this.challengeService.createChildChallenge(
      challengeData
    );
    return await this.challengeAuthorizationService.applyAuthorizationRules(
      childChallenge,
      challenge.authorization
    );
  }

  @UseGuards(GraphqlGuard)
  @Mutation(() => IOpportunity, {
    description: 'Creates a new Opportunity within the parent Challenge.',
  })
  @Profiling.api
  async createOpportunity(
    @CurrentUser() agentInfo: AgentInfo,
    @Args('opportunityData') opportunityData: CreateOpportunityInput
  ): Promise<IChallenge> {
    const challenge = await this.challengeService.getChallengeOrFail(
      opportunityData.challengeID
    );
    await this.authorizationEngine.grantAccessOrFail(
      agentInfo,
      challenge.authorization,
      AuthorizationPrivilege.CREATE,
      `opportunityCreate: ${challenge.nameID}`
    );
    const opportunity = await this.challengeService.createOpportunity(
      opportunityData
    );
    return await this.opportunityAuthorizationService.applyAuthorizationRules(
      opportunity,
      challenge.authorization
    );
  }

  @UseGuards(GraphqlGuard)
  @Mutation(() => IChallenge, {
    description: 'Updates the specified Challenge.',
  })
  @Profiling.api
  async updateChallenge(
    @CurrentUser() agentInfo: AgentInfo,
    @Args('challengeData') challengeData: UpdateChallengeInput
  ): Promise<IChallenge> {
    const challenge = await this.challengeService.getChallengeOrFail(
      challengeData.ID
    );
    await this.authorizationEngine.grantAccessOrFail(
      agentInfo,
      challenge.authorization,
      AuthorizationPrivilege.UPDATE,
      `challenge update: ${challenge.nameID}`
    );
    return await this.challengeService.updateChallenge(challengeData);
  }

  @UseGuards(GraphqlGuard)
  @Mutation(() => IChallenge, {
    description: 'Deletes the specified Challenge.',
  })
  async deleteChallenge(
    @CurrentUser() agentInfo: AgentInfo,
    @Args('deleteData') deleteData: DeleteChallengeInput
  ): Promise<IChallenge> {
    const challenge = await this.challengeService.getChallengeOrFail(
      deleteData.ID
    );
    await this.authorizationEngine.grantAccessOrFail(
      agentInfo,
      challenge.authorization,
      AuthorizationPrivilege.DELETE,
      `challenge delete: ${challenge.nameID}`
    );
    return await this.challengeService.deleteChallenge(deleteData);
  }

  @UseGuards(GraphqlGuard)
  @Mutation(() => IChallenge, {
    description: 'Trigger an event on the Challenge.',
  })
  async eventOnChallenge(
    @CurrentUser() agentInfo: AgentInfo,
    @Args('challengeEventData')
    challengeEventData: ChallengeEventInput
  ): Promise<IChallenge> {
    const challenge = await this.challengeService.getChallengeOrFail(
      challengeEventData.ID
    );
    await this.authorizationEngine.grantAccessOrFail(
      agentInfo,
      challenge.authorization,
      AuthorizationPrivilege.UPDATE,
      `event on challenge: ${challenge.nameID}`
    );
    return await this.challengeLifecycleOptionsProvider.eventOnChallenge(
      {
        eventName: challengeEventData.eventName,
        ID: challengeEventData.ID,
      },
      agentInfo
    );
  }

  @UseGuards(GraphqlGuard)
  @Mutation(() => IUser, {
    description:
      'Authorizes a User to be able to modify the state on the specified Challenge.',
  })
  @Profiling.api
  async authorizeStateModificationOnChallenge(
    @CurrentUser() agentInfo: AgentInfo,
    @Args('grantStateModificationVC')
    grantStateModificationVC: ChallengeAuthorizeStateModificationInput
  ): Promise<IUser> {
    const challenge = await this.challengeService.getChallengeOrFail(
      grantStateModificationVC.challengeID
    );
    await this.authorizationEngine.grantAccessOrFail(
      agentInfo,
      challenge.authorization,
      AuthorizationPrivilege.CREATE,
      `create VC on challenge (${challenge.nameID}) for user ${grantStateModificationVC.userID}`
    );

    return await this.challengeService.authorizeStateModification(
      grantStateModificationVC
    );
  }
}

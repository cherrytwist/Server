import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LogContext } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MachineOptions } from 'xstate';
import { LifecycleService } from '@domain/common/lifecycle/lifecycle.service';
import { OpportunityService } from './opportunity.service';
import {
  OpportunityEventInput,
  IOpportunity,
} from '@domain/collaboration/opportunity';
import { AgentInfo } from '@core/authentication';

@Injectable()
export class OpportunityLifecycleOptionsProvider {
  constructor(
    private lifecycleService: LifecycleService,
    private opportunityService: OpportunityService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  async eventOnOpportunity(
    eventData: OpportunityEventInput,
    agentInfo: AgentInfo
  ): Promise<IOpportunity> {
    const opportunityID = eventData.ID;
    const opportunity = await this.opportunityService.getOpportunityOrFail(
      opportunityID
    );
    const lifecycle = await this.opportunityService.getLifecycle(opportunityID);

    // Send the event, translated if needed
    this.logger.verbose?.(
      `Event ${eventData.eventName} triggered on Opportunity: ${opportunityID} using lifecycle ${lifecycle.id}`,
      LogContext.COMMUNITY
    );
    await this.lifecycleService.event(
      {
        ID: lifecycle.id,
        eventName: eventData.eventName,
      },
      this.challengeLifecycleMachineOptions,
      agentInfo,
      opportunity.authorization
    );

    return await this.opportunityService.getOpportunityOrFail(opportunityID);
  }

  private challengeLifecycleMachineOptions: Partial<
    MachineOptions<any, any>
  > = {
    actions: {
      sampleEvent: async (_, event: any) => {
        this.logger.verbose?.(
          `Command triggered on Opportunity with event: ${event.type}`,
          LogContext.CHALLENGES
        );
      },
    },
  };
}

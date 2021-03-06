import { AgentModule } from '@domain/agent/agent/agent.module';
import { LifecycleModule } from '@domain/common/lifecycle/lifecycle.module';
import { UserGroupModule } from '@domain/community/user-group/user-group.module';
import { UserModule } from '@domain/community/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationEngineModule } from '@src/services/platform/authorization-engine/authorization-engine.module';
import { ApplicationModule } from '@domain/community/application/application.module';
import { Community } from './community.entity';
import { CommunityLifecycleOptionsProvider } from './community.lifecycle.options.provider';
import { CommunityResolverFields } from './community.resolver.fields';
import { CommunityResolverMutations } from './community.resolver.mutations';
import { CommunityService } from './community.service';
import { CommunityAuthorizationService } from './community.service.authorization';
import { AuthorizationDefinitionModule } from '@domain/common/authorization-definition/authorization.definition.module';
import { CommunicationModule } from '@services/platform/communication/communication.module';

@Module({
  imports: [
    AuthorizationEngineModule,
    AuthorizationDefinitionModule,
    AgentModule,
    UserGroupModule,
    UserModule,
    ApplicationModule,
    LifecycleModule,
    CommunicationModule,
    TypeOrmModule.forFeature([Community]),
  ],
  providers: [
    CommunityService,
    CommunityAuthorizationService,
    CommunityResolverMutations,
    CommunityResolverFields,
    CommunityLifecycleOptionsProvider,
  ],
  exports: [CommunityService, CommunityAuthorizationService],
})
export class CommunityModule {}

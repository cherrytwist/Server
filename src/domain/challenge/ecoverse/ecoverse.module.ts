import { ChallengeModule } from '@domain/challenge/challenge/challenge.module';
import { ContextModule } from '@domain/context/context/context.module';
import { OrganisationModule } from '@domain/community/organisation/organisation.module';
import { TagsetModule } from '@domain/common/tagset/tagset.module';
import { UserGroupModule } from '@domain/community/user-group/user-group.module';
import { UserModule } from '@domain/community/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ecoverse } from './ecoverse.entity';
import { EcoverseResolverMutations } from './ecoverse.resolver.mutations';
import { EcoverseResolverQueries } from './ecoverse.resolver.queries';
import { EcoverseService } from './ecoverse.service';
import { CommunityModule } from '@domain/community/community/community.module';

@Module({
  imports: [
    ChallengeModule,
    ContextModule,
    CommunityModule,
    TagsetModule,
    OrganisationModule,
    UserGroupModule,
    TagsetModule,
    ChallengeModule,
    UserModule,
    TypeOrmModule.forFeature([Ecoverse]),
    UserModule,
  ],
  providers: [
    EcoverseService,
    EcoverseResolverQueries,
    EcoverseResolverMutations,
  ],
  exports: [EcoverseService],
})
export class EcoverseModule {}

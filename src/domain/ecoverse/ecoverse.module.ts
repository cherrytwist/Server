import { Module } from '@nestjs/common';
import { UserGroupModule } from '@domain/user-group/user-group.module';
import { EcoverseService } from './ecoverse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ecoverse } from './ecoverse.entity';
import { EcoverseResolverQueries } from './ecoverse.resolver.queries';
import { EcoverseResolverMutations } from './ecoverse.resolver.mutations';
import { ContextModule } from '@domain/context/context.module';
import { TagsetModule } from '@domain/tagset/tagset.module';
import { ChallengeModule } from '@domain/challenge/challenge.module';
import { UserModule } from '@domain/user/user.module';
import { OrganisationModule } from '@domain/organisation/organisation.module';
import { AccountModule } from '@utils/account/account.module';
import { ApplicationModule } from '@domain/application/application.module';

@Module({
  imports: [
    ChallengeModule,
    ContextModule,
    TagsetModule,
    OrganisationModule,
    UserGroupModule,
    TagsetModule,
    ChallengeModule,
    UserModule,
    TypeOrmModule.forFeature([Ecoverse]),
    UserModule,
    AccountModule,
    ApplicationModule,
  ],
  providers: [
    EcoverseService,
    EcoverseResolverQueries,
    EcoverseResolverMutations,
  ],
  exports: [EcoverseService],
})
export class EcoverseModule {}

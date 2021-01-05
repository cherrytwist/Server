import { Module } from '@nestjs/common';
import { UserGroupModule } from '@domain/user-group/user-group.module';
import { OrganisationService } from './organisation.service';
import { OrganisationResolverMutations } from './organisation.resolver.mutations';
import { TagsetModule } from '@domain/tagset/tagset.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from './organisation.entity';
import { OrganisationResolverFields } from './organisation.resolver.fields';
import { ProfileModule } from '@domain/profile/profile.module';

@Module({
  imports: [
    UserGroupModule,
    TagsetModule,
    ProfileModule,
    TypeOrmModule.forFeature([Organisation]),
  ],
  providers: [
    OrganisationService,
    OrganisationResolverMutations,
    OrganisationResolverFields,
  ],
  exports: [OrganisationService],
})
export class OrganisationModule {}

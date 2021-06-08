import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AspectModule } from '@domain/context/aspect/aspect.module';
import { Project } from './project.entity';
import { ProjectResolverMutations } from './project.resolver.mutations';
import { ProjectService } from './project.service';
import { LifecycleModule } from '@domain/common/lifecycle/lifecycle.module';
import { ProjectLifecycleOptionsProvider } from './project.lifecycle.options.provider';
import { ProjectResolverFields } from './project.resolver.fields';
import { NamingModule } from '@src/services/platform/ssi/agent/naming/naming.module';
import { AuthorizationEngineModule } from '@src/services/platform/authorization-engine/authorization-engine.module';

@Module({
  imports: [
    AuthorizationEngineModule,
    AspectModule,
    NamingModule,
    LifecycleModule,
    TypeOrmModule.forFeature([Project]),
  ],
  providers: [
    ProjectService,
    ProjectResolverMutations,
    ProjectResolverFields,
    ProjectLifecycleOptionsProvider,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}

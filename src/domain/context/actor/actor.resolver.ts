import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationRoles } from '@src/core/authorization/authorization.roles';
import { GqlAuthGuard } from '@src/core/authorization/graphql.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { ActorInput } from './actor.dto';
import { Actor } from './actor.entity';
import { IActor } from './actor.interface';
import { ActorService } from './actor.service';

@Resolver()
export class ActorResolver {
  constructor(private actorService: ActorService) {}

  @Roles(AuthorizationRoles.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, {
    description: 'Removes the actor  with the specified ID',
  })
  async removeActor(@Args('ID') actorID: number): Promise<boolean> {
    return await this.actorService.removeActor(actorID);
  }

  @Roles(AuthorizationRoles.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Actor, {
    description:
      'Updates the actor with the specified ID with the supplied data',
  })
  async updateActor(
    @Args('ID') actorID: number,
    @Args('actorData') actorData: ActorInput
  ): Promise<IActor> {
    return await this.actorService.updateActor(actorID, actorData);
  }
}

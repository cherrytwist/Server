import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IGroupable } from '@src/common/interfaces/groupable.interface';
import { Challenge } from '@domain/challenge/challenge/challenge.entity';
import { DID } from '@domain/agent/did/did.entity';
import { Ecoverse } from '@domain/challenge/ecoverse/ecoverse.entity';
import { Profile } from '@domain/community/profile/profile.entity';
import {
  RestrictedGroupNames,
  UserGroup,
} from '@domain/community/user-group/user-group.entity';
import { IOrganisation } from './organisation.interface';

@Entity()
@ObjectType()
export class Organisation extends BaseEntity
  implements IOrganisation, IGroupable {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { nullable: false, description: '' })
  @Column()
  name: string;

  @OneToOne(() => DID)
  @JoinColumn()
  DID!: DID;

  @OneToOne(
    () => Ecoverse,
    ecoverse => ecoverse.host
  )
  hostedEcoverse?: Ecoverse;

  @ManyToMany(
    () => Ecoverse,
    ecoverse => ecoverse.organisations
  )
  ecoverses?: Ecoverse[];

  @OneToOne(() => Profile, { eager: true, cascade: true })
  @JoinColumn()
  profile?: Profile;

  @OneToMany(
    () => UserGroup,
    userGroup => userGroup.organisation,
    { eager: false, cascade: true }
  )
  groups?: UserGroup[];

  @ManyToMany(
    () => Challenge,
    challenge => challenge.leadOrganisations
  )
  challenges!: Challenge[];

  // The restricted group names at the challenge level
  restrictedGroupNames?: string[];

  constructor(name: string) {
    super();
    this.name = name;
    this.restrictedGroupNames = [RestrictedGroupNames.Members];
  }
}
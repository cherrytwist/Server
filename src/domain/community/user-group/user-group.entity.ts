import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Organisation } from '@domain/community/organisation/organisation.entity';
import { User } from '@domain/community/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { IUserGroup } from './user-group.interface';
import { Profile } from '@domain/community/profile/profile.entity';
import { Community } from '../community';

@Entity()
@ObjectType()
export class UserGroup extends BaseEntity implements IUserGroup {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;

  @VersionColumn()
  version?: number;

  @Field(() => String)
  @Column()
  name: string;

  @ManyToMany(
    () => User,
    user => user.userGroups,
    { eager: false, cascade: true }
  )
  @JoinTable({ name: 'user_group_members' })
  members?: User[];

  @ManyToOne(
    () => User,
    user => user.focalPoints,
    { eager: false, cascade: true, onDelete: 'SET NULL' }
  )
  focalPoint?: User | null;

  @Field(() => Profile, {
    nullable: true,
    description: 'The profile for the user group',
  })
  @OneToOne(() => Profile, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;

  @Column()
  includeInSearch: boolean;

  @ManyToOne(
    () => Organisation,
    organisation => organisation.groups,
    { eager: false, cascade: false, onDelete: 'SET NULL' }
  )
  organisation?: Organisation;

  @ManyToOne(
    () => Community,
    community => community.groups,
    { eager: false, onDelete: 'CASCADE' }
  )
  community?: Community;

  // Flag to say whether members field should be populated
  membersPopulationEnabled = true;

  constructor(name: string) {
    super();
    this.name = name;
    this.includeInSearch = true;
  }
}

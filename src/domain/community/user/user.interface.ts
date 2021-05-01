import { IDID } from '@domain/agent/did/did.interface';
import { ICapability } from '@domain/common/capability';
import { IProfile } from '@domain/community/profile/profile.interface';
import { IUserGroup } from '@domain/community/user-group/user-group.interface';

export interface IUser {
  id: number;
  name: string;
  accountUpn: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  gender: string;
  DID: IDID;
  profile?: IProfile;
  userGroups?: IUserGroup[];
  capabilities?: ICapability[];
}

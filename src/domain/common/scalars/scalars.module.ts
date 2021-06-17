import { Module } from '@nestjs/common';
import { UUID } from './scalar.uuid';
import { NameID } from './scalar.nameid';
import { UUID_NAMEID } from './scalar.uuid.nameid';
import { UUID_NAMEID_EMAIL } from './scalar.uuid.nameid.email';
import { DID } from './scalar.did';

@Module({
  imports: [],
  providers: [NameID, UUID, UUID_NAMEID, UUID_NAMEID_EMAIL, DID],
  exports: [],
})
export class ScalarsModule {}

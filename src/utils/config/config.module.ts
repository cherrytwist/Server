import { Module } from '@nestjs/common';
import { KonfigService } from './config.service';
import { ConfigResolver } from './config.resolver';

@Module({
  providers: [KonfigService, ConfigResolver],
})
export class KonfigModule {}

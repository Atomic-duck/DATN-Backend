import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { subscribeProviders } from './subscribe.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SubscribeController],
  providers: [SubscribeService, ...subscribeProviders],
})
export class SubscribeModule { }

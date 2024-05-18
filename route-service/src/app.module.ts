import { Module } from '@nestjs/common';
import { WeathersModule } from './weathers/weathers.module';
import { RouteModule } from './route/route.module';
import { ConfigModule } from '@nestjs/config';
import { SubscribeModule } from './subscribe/subscribe.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    WeathersModule,
    RouteModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SubscribeModule, UsersModule],
})
export class AppModule { }

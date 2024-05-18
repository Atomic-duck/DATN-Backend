import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { camerasProviders } from './route.provider';

@Module({
  imports: [DatabaseModule, HttpModule, ConfigModule],
  controllers: [RouteController],
  providers: [RouteService, ...camerasProviders],
})
export class RouteModule { }

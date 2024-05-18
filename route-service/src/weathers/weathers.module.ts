import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { WeathersController } from './weathers.controller';
import { DatabaseModule } from 'src/database/database.module';
import { weathersProviders } from './weathers.providers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [WeathersController],
  providers: [WeathersService, ...weathersProviders],
})
export class WeathersModule { }

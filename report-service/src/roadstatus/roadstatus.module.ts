import { Module } from '@nestjs/common';
import { RoadstatusService } from './roadstatus.service';
import { RoadstatusController } from './roadstatus.controller';
import { S3Module } from 'src/s3/s3.module';
import { DatabaseModule } from 'src/database/database.module';
import { roadStatusProviders } from './roadstatus.provider';
import { PredictConsumer } from './predict.consumer';
import { KafkaModule } from 'src/kafka/kafka.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [S3Module, KafkaModule, FirebaseModule, HttpModule, DatabaseModule, ConfigModule],
  controllers: [RoadstatusController],
  providers: [RoadstatusService, PredictConsumer, ...roadStatusProviders]
})
export class RoadstatusModule { }

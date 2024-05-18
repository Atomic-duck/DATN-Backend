import { Module } from '@nestjs/common';

import { KafkaModule } from './kafka/kafka.module';
import { EmployeeModule } from './employee/employee.module';
import { RoadstatusModule } from './roadstatus/roadstatus.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { ConfigModule } from '@nestjs/config';
import { EmmitterService } from './emmitter/emmitter.service';
import { EmmitterModule } from './emmitter/emmitter.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [KafkaModule, EmployeeModule, RoadstatusModule, S3Module, ConfigModule.forRoot({ cache: true }), EmmitterModule, FirebaseModule,],
  providers: [S3Service, EmmitterService],
})
export class AppModule { }

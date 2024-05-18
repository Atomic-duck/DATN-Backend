import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { RoadstatusService } from './roadstatus.service';

@Injectable()
export class PredictConsumer implements OnModuleInit {
   constructor(
      private readonly _consumer: ConsumerService,
      private readonly roadstatusService: RoadstatusService
   ) { }

   async onModuleInit() {
      this._consumer.consume(
         'predict-client',
         { topics: ['predict-road-condition'] },
         {
            eachMessage: async ({ topic, partition, message }) => {
               console.log({
                  source: 'predict-consumer',
                  message: message.value.toString(),
                  partition: partition.toString(),
                  topic: topic.toString(),
               });

               this.roadstatusService.processPredict()
            },
         },
      );
   }
}

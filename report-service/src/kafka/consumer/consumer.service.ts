import {
  ConsoleLogger,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });

  private readonly consumers: Consumer[] = [];

  async consume(groupId: string, topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    try {
      const cosumer: Consumer = this.kafka.consumer({ groupId: groupId });

      await cosumer.connect().catch((e) => console.error(e));
      await cosumer.subscribe(topics);
      await cosumer.run(config);
      this.consumers.push(cosumer);
    } catch (error) {
      console.log('Error: ', error)
    }
  }
}

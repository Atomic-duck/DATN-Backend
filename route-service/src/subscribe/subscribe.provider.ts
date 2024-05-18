import { Mongoose } from 'mongoose';
import SubscribeSchema from './schemas/subscribe.schema';

export const subscribeProviders = [
   {
      provide: 'SUBSCRIBE_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Subscribe', SubscribeSchema, "subscribe-routes"),
      inject: ['DATABASE_CONNECTION'],
   },
];
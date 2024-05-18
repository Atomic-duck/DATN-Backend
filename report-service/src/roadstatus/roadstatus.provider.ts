import { Mongoose } from 'mongoose';
import RoadStatusSchema from './schemas/roadstatus.schema';

export const roadStatusProviders = [
   {
      provide: 'ROAD_STATUS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('RoadStatus', RoadStatusSchema, "road-status"),
      inject: ['DATABASE_CONNECTION'],
   },
];
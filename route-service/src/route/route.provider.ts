import { Mongoose } from 'mongoose';
import CameraSchema from './schemas/camera.schema';

export const camerasProviders = [
   {
      provide: 'CAMERA_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Camera', CameraSchema, "hcm-cameras"),
      inject: ['DATABASE_CONNECTION'],
   },
];
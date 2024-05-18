import { Mongoose } from 'mongoose';
import { DailyWeatherSchema } from './schemas/dailyWeathers.schema';
import { HourlyWeatherSchema } from './schemas/hourlyWeathers.schema';

export const weathersProviders = [
   {
      provide: 'DAILY_WEATHER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Weather', DailyWeatherSchema, "daily-weather"),
      inject: ['DATABASE_CONNECTION'],
   },
   {
      provide: 'HOURLY_WEATHER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('HourlyWeather', HourlyWeatherSchema, 'hourly-weather'),
      inject: ['DATABASE_CONNECTION'],
   },
];
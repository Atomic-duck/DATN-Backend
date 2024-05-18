import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DailyWeather extends Document {
   @Prop({ type: Number, required: true })
   lat: number;

   @Prop({ type: Number, required: true })
   lon: number;

   @Prop({ type: Number, required: true })
   dt: number;

   @Prop({ type: Number })
   sunrise?: number;

   @Prop({ type: Number })
   sunset?: number;

   @Prop({ type: Number })
   moonrise?: number;

   @Prop({ type: Number })
   moonset?: number;

   @Prop({ type: Number, required: true })
   moon_phase: number;

   @Prop({ type: String, required: true })
   summary: string;

   @Prop({ type: Object, required: true })
   temp: {
      morn: number;
      day: number;
      eve: number;
      night: number;
      min: number;
      max: number;
   };

   @Prop({ type: Object, required: true })
   feels_like: {
      morn: number;
      day: number;
      eve: number;
      night: number;
   };

   @Prop({ type: Number, required: true })
   pressure: number;

   @Prop({ type: Number, required: true })
   humidity: number;

   @Prop({ type: Number, required: true })
   dew_point: number;

   @Prop({ type: Number, required: true })
   wind_speed: number;

   @Prop({ type: Number })
   wind_gust?: number;

   @Prop({ type: Number, required: true })
   wind_deg: number;

   @Prop({ type: Number, required: true })
   clouds: number;

   @Prop({ type: Number })
   uvi?: number;

   @Prop({ type: Number, required: true })
   pop: number;

   @Prop({ type: Object })
   rain?: number;

   @Prop({ type: Object })
   snow?: number;

   @Prop({ type: [{ id: Number, main: String, description: String, icon: String }] })
   weather: { id: number; main: string; description: string; icon: string }[];
}

export const DailyWeatherSchema = SchemaFactory.createForClass(DailyWeather);

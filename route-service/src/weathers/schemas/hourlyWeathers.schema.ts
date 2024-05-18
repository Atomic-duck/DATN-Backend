import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class HourlyWeather extends Document {
   @Prop({ type: Number, required: true })
   lat: number;

   @Prop({ type: Number, required: true })
   lon: number;

   @Prop({ type: Number, required: true })
   dt: number;

   @Prop({ type: Number, required: true })
   temp: number;

   @Prop({ type: Number, required: true })
   feels_like: number;

   @Prop({ type: Number, required: true })
   pressure: number;

   @Prop({ type: Number, required: true })
   humidity: number;

   @Prop({ type: Number, required: true })
   dew_point: number;

   @Prop({ type: Number })
   uvi?: number;

   @Prop({ type: Number, required: true })
   clouds: number;

   @Prop({ type: Number })
   visibility?: number;

   @Prop({ type: Number, required: true })
   wind_speed: number;

   @Prop({ type: Number })
   wind_gust?: number;

   @Prop({ type: Number, required: true })
   wind_deg: number;

   @Prop({ type: Number, required: true })
   pop: number;

   @Prop({ type: Object })
   rain?: { '1h'?: number };

   @Prop({ type: Object })
   snow?: { '1h'?: number };

   @Prop({ type: [{ id: Number, main: String, description: String, icon: String }] })
   weather: { id: number; main: string; description: string; icon: string }[];
}

export const HourlyWeatherSchema = SchemaFactory.createForClass(HourlyWeather);
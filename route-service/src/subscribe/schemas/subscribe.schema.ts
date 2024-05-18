import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, } from 'mongoose';

@Schema()
export class Waypoint {
   @Prop()
   coordinates: [number, number];

   @Prop()
   name: string;
}

@Schema()
export class Subscribe extends Document {
   @Prop()
   email: string;

   @Prop()
   coordinates: [number, number][];

   @Prop()
   distance: number;

   @Prop()
   waypoints: Waypoint[];

   @Prop()
   name: string;

   @Prop()
   start: string;

   @Prop()
   end: string;

   @Prop()
   repeat: number[];

   @Prop({ default: true })
   isOn: boolean;

   @Prop({ default: Date.now() })
   once: number;
}

const SubscribeSchema = SchemaFactory.createForClass(Subscribe);

export default SubscribeSchema;

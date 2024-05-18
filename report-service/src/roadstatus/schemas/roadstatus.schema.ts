import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, } from 'mongoose';

@Schema()
export class RoadStatus extends Document {
   @Prop()
   email: string;

   @Prop()
   location: string

   @Prop()
   imgUrl: string;

   @Prop()
   coordinates: [number, number];

   @Prop()
   conditions: [any];

   @Prop()
   timestamp: number
}

const RoadStatusSchema = SchemaFactory.createForClass(RoadStatus);

export default RoadStatusSchema;

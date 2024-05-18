import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Camera extends Document {
   @Prop({ unique: true })
   camId: string;

   @Prop()
   type: string;

   @Prop()
   lat: number;

   @Prop()
   lon: number;

   @Prop()
   status: string;

   @Prop()
   display_name: string;
}

const CameraSchema = SchemaFactory.createForClass(Camera);
CameraSchema.index({ lat: 1, lon: 1 });

export default CameraSchema;

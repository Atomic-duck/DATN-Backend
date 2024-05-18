import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, } from 'mongoose';

@Schema()
export class User extends Document {
   @Prop()
   name: string;

   @Prop()
   email: string;

   @Prop()
   googleId: string; // Field to store Google ID for users registered with Google
}

const UserSchema = SchemaFactory.createForClass(User);

export default UserSchema;

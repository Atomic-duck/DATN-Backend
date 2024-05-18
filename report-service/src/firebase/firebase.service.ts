import { Inject, Injectable, Logger } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseService {
   private readonly logger = new Logger(FirebaseService.name);
   constructor(
      @Inject('FIREBASE_APP')
      private admin: app.App,
   ) { }

   sendNotification(topic: string, data: any, link: string) {

      const message = {
         data: {
            notifee: JSON.stringify(data),
            link
         },
         topic,
      };

      this.admin.messaging()
         .send(message)
         .then(response => {
            this.logger.log(`Successfully sent message: ${response}`);
         })
         .catch(error => {
            this.logger.error('Error sending message:', error);
            throw error
         });
   }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { Model } from 'mongoose';
import { Subscribe } from './schemas/subscribe.schema';

@Injectable()
export class SubscribeService {
  private readonly logger = new Logger(SubscribeService.name);
  constructor(
    @Inject('SUBSCRIBE_MODEL')
    private subscribeModel: Model<Subscribe>,
  ) { }

  // Method to add a new subscription
  async addSubscribeRoute(createSubscribeDto: CreateSubscribeDto): Promise<Subscribe> {
    try {
      const newSubscription = new this.subscribeModel(createSubscribeDto);
      const savedSubscription = await newSubscription.save();
      return savedSubscription;
    } catch (error) {
      this.logger.error(`Failed to add new route subscription: ${error.message}`);
      throw error;
    }
  }

  async updateSubscribeRoute(id: string, updateSubscribeDto: UpdateSubscribeDto): Promise<Subscribe> {
    try {
      const updatedSubscription = await this.subscribeModel.findByIdAndUpdate(id, updateSubscribeDto, {
        new: true, // Return the updated document
        runValidators: true, // Run mongoose validators on update
      });

      if (!updatedSubscription) {
        throw new Error(`Subscription with ID ${id} not found`);
      }

      this.logger.log(`Subscription updated successfully: ${updatedSubscription}`);
      return updatedSubscription;
    } catch (error) {
      this.logger.error(`Failed to update subscription: ${error.message}`);
      throw error;
    }
  }

  // Method to fetch subscriptions by email
  async getSubscriptionsByEmail(email: string): Promise<Subscribe[]> {
    try {
      const subscriptions = await this.subscribeModel.find({ email }, { email: 0 }).exec();
      return subscriptions;
    } catch (error) {
      this.logger.error(`Failed to fetch subscriptions by email: ${error.message}`);
      throw error;
    }
  }

  // Method to fetch subscriptions by email
  async getSubCoordinatesByEmail(email: string): Promise<Subscribe[]> {
    try {
      const subCoor = await this.subscribeModel.find({ email }).select('coordinates').exec();
      return subCoor;
    } catch (error) {
      this.logger.error(`Failed to fetch subscriptions by email: ${error.message}`);
      throw error;
    }
  }

  async getCoordinatesById(id: string): Promise<Subscribe> {
    try {
      const subscription = await this.subscribeModel.findById(id).select('coordinates').exec();
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to fetch subscription by id: ${error.message}`);
      throw error;
    }
  }

  // Method to delete a subscription by ID
  async deleteSubscriptionById(subscriptionId: string): Promise<void> {
    try {
      const deletedSubscription = await this.subscribeModel.findByIdAndDelete(subscriptionId).exec();
      if (!deletedSubscription) {
        throw new Error(`Subscription with ID ${subscriptionId} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete subscription: ${error.message}`);
      throw error;
    }
  }
}

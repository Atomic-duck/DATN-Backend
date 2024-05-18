import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Res, HttpStatus, NotFoundException, InternalServerErrorException, BadRequestException, Query } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { Subscribe } from './schemas/subscribe.schema';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async addSubscribe(@Body() createSubscribeDto: CreateSubscribeDto, @Res() res): Promise<void> {
    try {
      const result = await this.subscribeService.addSubscribeRoute(createSubscribeDto);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Error adding subscription:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while adding subscription.' });
    }
  }

  @Post(':id/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSubscribe(@Param('id') id: string, @Body() updateSubscribeDto: UpdateSubscribeDto, @Res() res): Promise<void> {
    try {
      if (!id) {
        throw new BadRequestException('Subscription ID is required.');
      }

      const updatedSubscription = await this.subscribeService.updateSubscribeRoute(id, updateSubscribeDto);

      res.status(HttpStatus.OK).json(updatedSubscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      const status = error instanceof BadRequestException ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message: error.message });
    }
  }

  @Get()
  async getSubscriptionsByEmail(@Query('email') email: string, @Res() res): Promise<void> {
    try {
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email parameter is required.' });
        return;
      }

      const subscriptions = await this.subscribeService.getSubscriptionsByEmail(email);
      res.status(HttpStatus.OK).json(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions by email:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while fetching subscriptions.' });
    }
  }

  @Get(':id')
  async getSubscriptionsById(@Param('id') id: string, @Res() res): Promise<void> {
    try {
      const subscription = await this.subscribeService.getCoordinatesById(id);
      res.status(HttpStatus.OK).json(subscription);
    } catch (error) {
      console.error('Error fetching subscription by id:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while fetching subscription.' });
    }
  }

  @Delete('/delete/:id')
  async deleteSubscriptionById(@Param('id') id: string, @Res() res): Promise<void> {
    try {
      await this.subscribeService.deleteSubscriptionById(id);
      res.status(HttpStatus.OK).json({ message: 'Delete successfully' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else {
        console.error('Error deleting subscription:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting subscription.' });
      }
    }
  }
}

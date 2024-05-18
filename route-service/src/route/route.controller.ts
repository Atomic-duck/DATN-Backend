import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { RouteService } from './route.service';
import { FindRoutesRequest } from './dto/find-route.dto';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) { }

  @Get('reverse')
  async getLocationName(@Query('long') long, @Query('lat') lat, @Res() res): Promise<void> {
    try {
      const name = await this.routeService.reverseGeocoding(long, lat);
      res.status(HttpStatus.OK).json({ name });
    } catch (error) {
      // Handle errors appropriately
      console.error('Error finding routes:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while reverse geocoding.' });
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findRoutes(@Body() requestBody: FindRoutesRequest, @Res() res): Promise<void> {
    try {
      const { waypoints, options } = requestBody;
      console.log(waypoints);

      const response = await this.routeService.findRoutes(waypoints);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      // Handle errors appropriately
      console.error('Error finding routes:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while fetching routes.' });
    }
  }

  @Post('cameras')
  async getCameras(@Body() coordinates: [number, number][], @Res() res): Promise<void> {
    try {
      const nearbyCameras = await this.routeService.getCamera(coordinates);
      res.status(HttpStatus.OK).json(nearbyCameras);
    } catch (error) {
      // Handle errors appropriately
      console.error('Error getting nearby cameras:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while fetching nearby cameras.' });
    }
  }
}

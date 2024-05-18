import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { HourlyWeather } from './schemas/hourlyWeathers.schema';
import { ErrorMessage } from 'src/response/ErrorMessage.interface';
import { DailyWeather } from './schemas/dailyWeathers.schema';
import { WeatherDTO } from './interfaces/weathers.interface';

@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) { }

  @Get('hourly')
  async getHourlyWeather(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('dt') dt: number,
    @Query('range') range: number = 1,
  ): Promise<HourlyWeather[] | ErrorMessage> {
    if (lat === undefined || lon === undefined || dt === undefined) {
      return { code: 400, message: 'Please provide values for lat, lon, and dt.' };
    }

    return this.weathersService.findHourlyWeather(lat, lon, dt, range);
  }

  @Get('daily')
  async getDailyWeather(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('dt') dt: number,
    @Query('range') range: number = 1,
  ): Promise<DailyWeather[] | ErrorMessage> {
    if (lat === undefined || lon === undefined || dt === undefined) {
      return { code: 400, message: 'Please provide values for lat, lon, and dt.' };
    }

    return this.weathersService.findDailyWeather(lat, lon, dt, range);
  }

  @Get('current')
  async getCurrentWeather(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
  ): Promise<WeatherDTO | ErrorMessage> {
    if (lat === undefined || lon === undefined) {
      return { code: 400, message: 'Please provide values for lat and lon.' };
    }

    return this.weathersService.findWeather(lat, lon);
  }

  @Post('daily')
  async createDailyWeatherBulk(@Body() dailyWeatherDataList: Partial<DailyWeather>[]): Promise<DailyWeather[]> {
    return this.weathersService.createDailyWeather(dailyWeatherDataList);
  }

  @Post('hourly')
  async createHourlyWeatherBulk(@Body() hourlyWeatherDataList: Partial<HourlyWeather>[]): Promise<HourlyWeather[]> {
    return this.weathersService.createHourlyWeather(hourlyWeatherDataList);
  }

  // TODO: add api to get current weather and weather
}

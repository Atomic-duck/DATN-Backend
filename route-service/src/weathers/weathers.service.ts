import { Body, Delete, Get, Inject, Injectable, Logger, Param, Post } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { Model } from 'mongoose';
import { HourlyWeather } from './schemas/hourlyWeathers.schema';
import { DailyWeather } from './schemas/dailyWeathers.schema';
import { CurrentWeather, WeatherDTO } from './interfaces/weathers.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';


@Injectable()
export class WeathersService {
  private readonly logger = new Logger(WeathersService.name);
  constructor(
    @Inject('DAILY_WEATHER_MODEL')
    private dailyWeatherModel: Model<DailyWeather>,

    @Inject('HOURLY_WEATHER_MODEL')
    private hourlyWeatherModel: Model<HourlyWeather>,

    private readonly httpService: HttpService
  ) { }

  async createHourlyWeather(hourlyWeatherDataList: Partial<HourlyWeather>[]): Promise<HourlyWeather[]> {
    const createdHourlyWeatherList = await this.hourlyWeatherModel.create(hourlyWeatherDataList);
    return createdHourlyWeatherList;
  }

  async createDailyWeather(dailyWeatherDataList: Partial<DailyWeather>[]): Promise<DailyWeather[]> {
    const createdDailyWeatherList = await this.dailyWeatherModel.create(dailyWeatherDataList);
    return createdDailyWeatherList;
  }

  async findHourlyWeather(lat: number, lon: number, dt: number, range: number = 24): Promise<HourlyWeather[]> {
    console.log(lat, lon, dt, range);

    try {
      const hourlyWeather = await this.hourlyWeatherModel
        .find({
          lat,
          lon,
          dt: { $gt: dt },
        })
        .sort({ dt: 1 }) // Sort by dt in ascending order
        .limit(range)
        .exec();

      return hourlyWeather;
    } catch (error) {
      // Handle errors, log, or throw further if needed
      console.error('Error fetching hourly weather:', error);
      throw error;
    }
  }

  async findDailyWeather(lat: number, lon: number, dt: number, range: number = 14): Promise<DailyWeather[]> {
    console.log(lat, lon, dt, range);

    try {
      const dailyWeather = await this.dailyWeatherModel
        .find({
          lat,
          lon,
          dt: { $gt: dt },
        })
        .sort({ dt: 1 }) // Sort by dt in ascending order
        .limit(range)
        .exec();

      return dailyWeather;
    } catch (error) {
      // Handle errors, log, or throw further if needed
      console.error('Error fetching daily weather:', error);
      throw error;
    }
  }

  async findCurrentWeather(lat: number, lon: number): Promise<WeatherDTO> {
    const apiKey = '9f796948bc105f93351ac290f7d62883';
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&units=metric&appid=${apiKey}&lang=vi`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<WeatherDTO>(apiUrl).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );

      return data;
    } catch (error) {
      // Handle errors, log, or throw further if needed
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  async findWeather(lat: number, lon: number): Promise<WeatherDTO> {
    console.log(lat, lon);

    try {
      const currentWeather = await this.findCurrentWeather(lat, lon);
      // const hourlyWeather = await this.findHourlyWeather(lat, lon, currentWeather.current.dt);
      // const dailyWeather = await this.findDailyWeather(lat, lon, currentWeather.current.dt);
      const hourlyWeather = await this.findHourlyWeather(lat, lon, 1709218800);
      const dailyWeather = await this.findDailyWeather(lat, lon, 1709218800);


      currentWeather.hourly = hourlyWeather;
      currentWeather.daily = dailyWeather;

      return currentWeather;
    } catch (error) {
      // Handle errors, log, or throw further if needed
      console.error('Error fetching daily weather:', error);
      throw error;
    }
  }

  // async findRangeWeather(lat: number, lon: number, begin_dt: number, end_dt: number): Promise<WeatherDTO> {
  //   console.log(lat, lon);

  //   try {

  //   } catch (error) {

  //   }
  // }
}

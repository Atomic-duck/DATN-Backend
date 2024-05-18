export interface CurrentWeather {
   lat: number;
   lon: number;
   dt: number;
   sunrise?: number;
   sunset?: number;
   temp: number;
   feels_like: number;
   pressure: number;
   humidity: number;
   dew_point: number;
   clouds: number;
   uvi?: number;
   visibility?: number;
   wind_speed: number;
   wind_gust?: number;
   wind_deg: number;
   rain?: {
      '1h'?: number;
   };
   snow?: {
      '1h'?: number;
   };
   weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
   }[];
}

export interface HourlyWeather {
   lat: number;
   lon: number;
   dt: number;
   temp: number;
   feels_like: number;
   pressure: number;
   humidity: number;
   dew_point: number;
   uvi?: number;
   clouds: number;
   visibility?: number;
   wind_speed: number;
   wind_gust?: number;
   wind_deg: number;
   pop: number;
   rain?: {
      '1h'?: number;
   };
   snow?: {
      '1h'?: number;
   };
   weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
   }[];
}

export interface DailyWeather {
   lat: number;
   lon: number;
   dt: number;
   sunrise?: number;
   sunset?: number;
   moonrise?: number;
   moonset?: number;
   moon_phase: number;
   summary: string;
   temp: {
      morn: number;
      day: number;
      eve: number;
      night: number;
      min: number;
      max: number;
   };
   feels_like: {
      morn: number;
      day: number;
      eve: number;
      night: number;
   };
   pressure: number;
   humidity: number;
   dew_point: number;
   wind_speed: number;
   wind_gust?: number;
   wind_deg: number;
   clouds: number;
   uvi?: number;
   pop: number;
   rain?: number;
   snow?: number;
   weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
   }[];
}

export interface WeatherDTO {
   lat: number;
   lon: number;
   timezone: string;
   timezone_offset: number;
   current: CurrentWeather;
   hourly?: HourlyWeather[];
   daily?: DailyWeather[];
}
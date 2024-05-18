import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Camera } from './schemas/camera.schema';
import { Model } from 'mongoose';

@Injectable()
export class RouteService {
  private readonly logger = new Logger(RouteService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('CAMERA_MODEL')
    private cameraModel: Model<Camera>,
  ) { }

  async reverseGeocoding(long: number, lat: number) {
    const accessToken = this.configService.get<String>("ACCESS_TOKEN");
    const url = `https://api.mapbox.com/search/geocode/v6/reverse`;
    const params = {
      longitude: long,
      latitude: lat,
      types: 'neighborhood,locality',
      language: 'vi',
      access_token: accessToken,
    };

    this.logger.log(lat)

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, { params }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );

      if (data.features.length == 1) {
        return data.features[0].properties.full_address
      } else if (data.features.length > 1) {
        let name: string = data.features[0].properties.full_address;
        let result = '';
        let count = 0;
        for (let i = 0; i < name.length; i++) {
          if (name[i] == ',') {
            count++;
          }
          if (count == 1) continue;

          result += name[i];
        }
        return result;
      }

      return '';
    } catch (error) {
      // Handle errors, log, or throw further if needed
      console.error('Error fetching reverse geocoding:', error);
      throw error;
    }
  }

  async findRoutesWithFilter(waypoints: [number, number][], options: { avoidRain: boolean; avoidFlooded: boolean }): Promise<AxiosResponse<any>> {
    try {
      const routes = this.findRoutes(waypoints);

      if (options.avoidFlooded) {

      }

      return routes;
    } catch (error) {
      // Handle errors, log, or throw further if needed
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  async findRoutes(waypoints: [number, number][]): Promise<AxiosResponse<any>> {
    const accessToken = this.configService.get<String>("ACCESS_TOKEN");
    const baseUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving';
    const waypointsString = waypoints.map(wp => wp.join(',')).join(';');
    const url = `${baseUrl}/${waypointsString}`;

    const params = {
      alternatives: true,
      annotations: 'speed,duration',
      geometries: 'geojson',
      overview: 'full',
      steps: false,
      notifications: 'none',
      access_token: accessToken,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, { params }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );

      return data;
    } catch (error) {
      // Handle errors, log, or throw further if needed
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  async findNonFloodedRoute(coordinates: [number, number][]) {
    let floodedRoad: [[number, number][]?] = [];
    for (let i = 1; i <= coordinates.length; i++) {
      // getFloodedSegmentInfo
      // if not flooded -> continue
      // else if continuos -> add to floodedRoad[size-1].add(coordinates[i])
      // else -> add to floodedRoad.add([coordinates[i-1], coordinates[i]])
    }

    // k gop
    for (let i = 0; i < floodedRoad.length; i++) {
      let routes = this.findRoutes(floodedRoad[i]);
      // get coordinates of routees
      // findNonFloodedRoute(coordinates)
    }

    // gop 2 road
    // gop 3 road
    // gop n road
  }

  async getFloodedSegmentCondition(segment: [number, number][]): Promise<boolean> {
    let cameraId = this.getCamera(segment);
    // if camera exist -> query to ai service to get flooded info -> current and forecast
    // else return unknown flooded condition

    return false;
  }

  async getCamera(coordinates: [number, number][]): Promise<Camera[]> {
    try {
      const nearbyCameras: Camera[] = [];
      const camIdSet: Set<string> = new Set<string>();
      const distanceThreshold = 20; // Threshold distance in meters

      for (const coordinate of coordinates) {
        // Fetch cameras within a square bounding box around the coordinate
        const camerasInRange = await this.cameraModel.find({
          lon: { $gte: coordinate[0] - 0.00045, $lte: coordinate[0] + 0.00045 },
          lat: { $gte: coordinate[1] - 0.00045, $lte: coordinate[1] + 0.00045 },
        }).select({ __v: 0, _id: 0 });

        // Calculate the distance between each camera and the coordinate
        for (const camera of camerasInRange) {
          const cameraDistance = this.calculateDistance(coordinate, [camera.lon, camera.lat]);

          if (cameraDistance <= distanceThreshold && !camIdSet.has(camera.camId)) {
            nearbyCameras.push(camera);
            camIdSet.add(camera.camId);
          }
        }
      }

      return nearbyCameras;
    } catch (error) {
      this.logger.error(`Error fetching nearby cameras: ${error.message}`);
      throw error;
    }
  }

  calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    // Calculate distance using the Haversine formula
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}

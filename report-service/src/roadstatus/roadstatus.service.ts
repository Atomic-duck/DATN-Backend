import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRoadstatusDto } from './dto/create-roadstatus.dto';
import { S3Service } from 'src/s3/s3.service';
import { RoadStatus } from './schemas/roadstatus.schema';
import { Model } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class RoadstatusService {
  private readonly logger = new Logger(RoadstatusService.name);

  constructor(
    @Inject('ROAD_STATUS_MODEL')
    private roadStatusModel: Model<RoadStatus>,
    private readonly s3: S3Service,
    private readonly firebase: FirebaseService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
  }

  async findAllRoadStatus() {
    try {
      return await this.roadStatusModel.find().exec();;
    } catch (error) {
      this.logger.error(`Failed to fetch all road status: ${error.message}`);
      throw error;
    }
  }

  processRoadStatus(image: Express.Multer.File, createRoadstatusDto: CreateRoadstatusDto) {
    try {
      // notifee
      this.firebase.sendNotification('road-status', {
        coordinates: createRoadstatusDto.coordinates,
        conditions: createRoadstatusDto.conditions,
        timestamp: createRoadstatusDto.timestamp
      }, 'myapp://map');

      this.s3.uploadFile(image).then(async (url) => {
        let location = await this.reverseGeocoding(createRoadstatusDto.coordinates[0], createRoadstatusDto.coordinates[1]);
        this.saveRoadStatusToDB({ ...createRoadstatusDto, imgUrl: url, location });
      });
    } catch (error) {
      this.logger.error(`Error processing road status: ${error.message}`);
      throw error;
    }
  }

  processPredict() {

  }

  private async saveRoadStatusToDB(roadStatus: any) {
    const status = new this.roadStatusModel(roadStatus);
    const savedStatus = await status.save();
    return savedStatus;
  }

  async reverseGeocoding(long: number, lat: number): Promise<string> {
    const accessToken = this.configService.get<String>("ACCESS_TOKEN");
    const url = `https://api.mapbox.com/search/geocode/v6/reverse`;
    const params = {
      longitude: long,
      latitude: lat,
      types: 'neighborhood,locality',
      language: 'vi',
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
}

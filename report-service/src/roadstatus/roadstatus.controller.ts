import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UsePipes, ValidationPipe, Res, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { RoadstatusService } from './roadstatus.service';
import { CreateRoadstatusDto } from './dto/create-roadstatus.dto';
import { UpdateRoadstatusDto } from './dto/update-roadstatus.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('roadstatus')
export class RoadstatusController {
  constructor(private readonly roadstatusService: RoadstatusService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async uploadRoadStatus(@UploadedFile(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 1000 }),
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
    }),
  ) image: Express.Multer.File, @Body() createRoadstatusDto: CreateRoadstatusDto, @Res() res) {
    try {
      this.roadstatusService.processRoadStatus(image, createRoadstatusDto);

      res.status(HttpStatus.OK).json({ message: 'ok' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while fetching uploading road status' });
    }
  }

  @Get('all')
  async getAllRoadStatus(@Res() res): Promise<void> {
    try {
      let response = await this.roadstatusService.findAllRoadStatus();

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error('Error fetching road status:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while fetching road status.' });
    }
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,

  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './create-business.dto';
import { UpdateBusinessDto } from './update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@Body() body: CreateBusinessDto) {
    return this.businessesService.create(body);
  }

  @Get()
  findAll(@Request() request: any) {
    return this.businessesService.findAll(request.user.businessId);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() request: any) {
    return this.businessesService.findById(
      id,
      request.user.businessId,
    );
  }
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
    @Request() request: any,
   ) {
    return this.businessesService.deactivate(
       id,
       request.user.businessId,
    );
  }
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: any) {
    return this.businessesService.remove(
       id,
       request.user.businessId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateBusinessDto,
    @Request() request: any,
  ) {
    return this.businessesService.update(
      id,
      request.user.businessId,
      body,
    );
  }
}

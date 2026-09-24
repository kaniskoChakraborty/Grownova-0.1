import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './create-business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@Body() body: CreateBusinessDto) {
    return this.businessesService.create(body);
  }

  @Get()
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.businessesService.findById(id);
  }
}

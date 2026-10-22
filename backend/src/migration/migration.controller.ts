import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MigrationService } from './migration.service';

@Controller('migration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    required: ['file'],
  },
})
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileType = this.detectFileType(file);

    return this.migrationService.parseFile(file.buffer, fileType);
  }

  private detectFileType(
    file: Express.Multer.File,
  ): 'excel' | 'tally_xml' {
    const extension = file.originalname.toLowerCase().split('.').pop();

    if (extension === 'xml') {
      return 'tally_xml';
    }

    if (extension === 'xlsx' || extension === 'xls') {
      return 'excel';
    }

    throw new BadRequestException(
      'Unsupported file type. Use .xml, .xlsx, or .xls',
    );
  }
}

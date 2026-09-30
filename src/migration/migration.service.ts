import { BadRequestException, Injectable } from '@nestjs/common';
import { ExcelParser } from './parsers/excel.parser';
import { TallyParser } from './parsers/tally.parser';
import { NormalizedMigrationResult } from './contracts/migration.contract';

@Injectable()
export class MigrationService {
  private readonly excelParser = new ExcelParser();
  private readonly tallyParser = new TallyParser();

  parseFile(
    buffer: Buffer,
    fileType: 'excel' | 'tally_xml',
  ): NormalizedMigrationResult {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Uploaded file is empty');
    }

    if (fileType === 'excel') {
      return this.excelParser.parse(buffer);
    }

    if (fileType === 'tally_xml') {
      return this.tallyParser.parse(buffer);
    }

    throw new BadRequestException('Unsupported migration file type');
  }
}

import * as XLSX from 'xlsx';
import {
  NormalizedMigrationRecord,
  NormalizedMigrationResult,
} from '../contracts/migration.contract';

export class ExcelParser {
  parse(buffer: Buffer): NormalizedMigrationResult {
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
      cellDates: true,
    });

    const records: NormalizedMigrationRecord[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: null,
      });

      for (const row of rows) {
        records.push({
          source: 'excel',
          entity: sheetName,
          data: row,
        });
      }
    }

    return {
      source: 'excel',
      records,
      totalRecords: records.length,
    };
  }
}

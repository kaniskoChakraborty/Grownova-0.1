import { XMLParser } from 'fast-xml-parser';
import {
  NormalizedMigrationRecord,
  NormalizedMigrationResult,
} from '../contracts/migration.contract';

export class TallyParser {
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: true,
    trimValues: true,
  });

  parse(buffer: Buffer): NormalizedMigrationResult {
    const xml = buffer.toString('utf-8');
    const parsed = this.parser.parse(xml);

    const records: NormalizedMigrationRecord[] = [];

    this.extractRecords(parsed, records);

    return {
      source: 'tally_xml',
      records,
      totalRecords: records.length,
    };
  }

  private extractRecords(
    value: unknown,
    records: NormalizedMigrationRecord[],
    entity = 'tally',
  ): void {
    if (Array.isArray(value)) {
      for (const item of value) {
        this.extractRecords(item, records, entity);
      }
      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    const object = value as Record<string, unknown>;

    for (const [key, child] of Object.entries(object)) {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object') {
            records.push({
              source: 'tally_xml',
              entity: key,
              data: item as Record<string, unknown>,
            });
          }
        }
      } else if (child && typeof child === 'object') {
        this.extractRecords(child, records, key);
      }
    }

    if (Object.keys(object).length > 0 && entity !== 'tally') {
      const alreadyRecorded = records.some(
        (record) => record.entity === entity && record.data === object,
      );

      if (!alreadyRecorded) {
        records.push({
          source: 'tally_xml',
          entity,
          data: object,
        });
      }
    }
  }
}

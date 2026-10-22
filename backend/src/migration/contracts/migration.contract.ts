export type MigrationSource = 'tally_xml' | 'excel';

export interface NormalizedMigrationRecord {
  source: MigrationSource;
  entity: string;
  data: Record<string, unknown>;
}

export interface NormalizedMigrationResult {
  source: MigrationSource;
  records: NormalizedMigrationRecord[];
  totalRecords: number;
}

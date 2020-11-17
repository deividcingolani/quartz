export interface ComputedDataRow {
  columnName: string;
  columnValue: string;
  isPrimary: boolean;
  isPartition: boolean;
}

export interface ComputedData {
  type: string;
  row: ComputedDataRow[];
}

export enum StorageConnectorType {
  'offline' = 'offline',
  'online' = 'online',
}

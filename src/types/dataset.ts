export interface Dataset {
  type: string;
  href: string;
  accepted: boolean;
  attributes: Record<string, unknown>;
  datasetType: string;
  description: string;
  id: number;
  name: string;
  permission: string;
  publicDataset: number;
  searchable: boolean;
  shared: boolean;
  sharedBy: { href: string };
  acceptedBy: { href: string };
  sharedWith: string;
}

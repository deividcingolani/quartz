import { FeatureGroup } from './feature-group';

export interface ServerRule {
  name: string;
  level: string;
  min?: number;
  max?: number;
  legalValues?: string[];
  pattern?: string;
  acceptedType?: string;
}

export interface Expectation {
  name: string;
  description: string;
  features: string[];
  rules: ServerRule[];
  attachedFeatureGroups?: FeatureGroup[];
}

export interface Rule {
  name: string;
  predicate: string;
  valueType: string;
}

export interface Validation {
  status: string;
  validationId: number;
  validationTime: number;
  expectationResults: {
    status: string;
    expectation: Expectation;
    results: {
      feature: string;
      message: string;
      rule: any;
      status: string;
      value: string;
    }[];
  }[];
}

export interface TabField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  required?: boolean;
  options?: Array<{ value: any; label: string }>;
}

export interface TabColumn {
  key: string;
  label: string;
}

export interface Tab {
  id: string;
  label: string;
  columns: TabColumn[];
  fields: TabField[];
  endpoint: string;
}

export interface FormData {
  [key: string]: any;
}

export interface SelectOption {
  value: any;
  label: string;
} 
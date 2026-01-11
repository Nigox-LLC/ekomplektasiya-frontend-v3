export interface BaseReference {
  id: number;
  name: string;
  prefix?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Region extends BaseReference {}

export interface District extends BaseReference {
  region: number; // Foreign key ID
}

export interface Department extends BaseReference {
  index_number?: string;
  region?: number;
  district?: number;
  posted_site_link?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Position extends BaseReference {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProductType extends BaseReference {}

export interface ProductModel extends BaseReference {
  product_type: number;
}

export interface Unit extends BaseReference {
  description?: string;
}

export interface Size extends BaseReference {
  product_model_id: number;
}

// For Dashboard Tiles
export interface ReferenceTile {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Lucide icon component
  path: string;
  color: string;
}

export interface Region {
    id: number;
    name: string;
}

export interface District {
    id: number;
    name: string;
}

export interface Department {
    id: number;
    name: string;
}

export interface Position {
    id: number;
    name: string;
}

export interface Warehouse {
    id: number;
    name: string;
}

export interface EmployeeDetail {
    id: number;
    full_name: string;
    region?: Region;
    district?: District;
    department?: Department;
    position?: Position;
    inn?: string;
    phone?: string;
    address?: string;
    birth_date?: string;
    passport_series?: string;
    passport_number?: string;
    passport_image?: string;
    jshshr?: string;
    warehouse?: Warehouse[]; // Spec says array of objects
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface EmployeeListItem {
    id: number;
    full_name: string;
    phone?: string;
    region?: string; // API returns name
    district?: string; // API returns name
    department?: string; // API returns name
    position?: string; // API returns name
    is_active: boolean;
}

export interface EmployeeCreateUpdate {
    full_name: string;
    region: number;
    district: number;
    department: number;
    position: number;
    inn?: string;
    phone?: string;
    address?: string;
    birth_date?: string;
    passport_series?: string;
    passport_number?: string;
    jshshr?: string;
    warehouse?: number[];
    is_active?: boolean;
}

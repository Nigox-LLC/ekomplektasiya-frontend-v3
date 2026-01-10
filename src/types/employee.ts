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

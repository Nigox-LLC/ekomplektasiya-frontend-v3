export interface Permission {
    id: number;
    name: string;
    codename: string;
    app_label: string;
    model: string;
}

export interface UserWithPermissions {
    id: number;
    username: string;
    full_name: string | null;
    role: string;
    region?: string | { id: number; name: string };
    district?: string | { id: number; name: string };
    department?: string | { id: number; name: string };
    position?: string | { id: number; name: string };
    is_active: boolean;
    user_permissions: number[]; // List of permission IDs
}

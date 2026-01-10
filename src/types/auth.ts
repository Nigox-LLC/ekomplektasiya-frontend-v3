export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
}

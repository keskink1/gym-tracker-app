export interface AuthRegisterRequest {
    organizationName: string;
    email: string;
    fullName: string;
    password: string;
}

export interface AuthRegisterResponse {
    user: {
        email: string;
        fullName: string;
    }
}

export interface AuthLoginRequest {
    email: string;
    password: string;
}

export interface AuthLoginResponse {
    token: string;
    user: {
        email: string;
        fullName: string;
    }
}
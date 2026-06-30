export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  token: string;
  uid: string;
  verified: boolean;
  message?: string;
}
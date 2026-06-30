import api from "./petApi";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyRequest,
  AuthResponse,
} from "../types/Auth";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const verify = async (data: VerifyRequest): Promise<AuthResponse> => {
  const response = await api.post("/auth/verify", data);
  return response.data;
};
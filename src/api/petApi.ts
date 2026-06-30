import axios from "axios";
import type { Pet } from "../types/Pet";
import type { Responsible } from "../types/Responsible";
import type { HealthRecord } from "../types/HealthRecord";
import type { User } from "../types/User";

export interface PetQrData {
  pid: string;
  public: boolean;
}

export interface AddResponsibleRequest {
  userUid: string;
  accessLevel: string;
  responsibleRole: string;
}

export interface HealthRecordRequest {
  type: string;
  title: string;
  description: string;
  date: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface PetPageParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface HealthRecordPageParams {
  pid: string;
  page?: number;
  size?: number;
  type?: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFriendlyErrorMessage = (error: unknown): string => {
  if (axios.isCancel(error)) {
    return "The request was cancelled.";
  }

  if (!axios.isAxiosError(error)) {
    return "An unexpected error occurred. Please try again.";
  }

  if (!error.response) {
    return "Could not connect to the server. Check your internet connection.";
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return "Some information is invalid. Please review the form.";
    case 401:
      return "Your session expired. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested information was not found.";
    case 409:
      return "There is a conflict with the current information.";
    case 500:
      return "The server had a problem. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
};

const clearSessionAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  const currentPath = window.location.pathname;

  const publicRoutes = ["/", "/login", "/register", "/verify"];

  const isPublicPetPage = currentPath.startsWith("/public/pets/");
  const isAlreadyPublicRoute = publicRoutes.some(
    (route) => currentPath === route
  );

  if (!isAlreadyPublicRoute && !isPublicPetPage) {
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearSessionAndRedirect();
    }

    return Promise.reject(error);
  }
);

export const getMe = async (signal?: AbortSignal): Promise<User> => {
  const response = await api.get("/user/me", {
    signal,
  });

  return response.data;
};

export const getMyPets = async (signal?: AbortSignal): Promise<Pet[]> => {
  const response = await api.get("/pets/me", {
    signal,
  });

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.content ?? [];
};

export const getMyPetsPaginated = async ({
  page = 0,
  size = 10,
  search = "",
}: PetPageParams): Promise<PageResponse<Pet>> => {
  const response = await api.get("/pets/me", {
    params: {
      page,
      size,
      search: search || undefined,
    },
  });

  return response.data;
};

export const getPetById = async (pid: string): Promise<Pet> => {
  const response = await api.get(`/pets/${pid}`);
  return response.data;
};

export const getPetQrData = async (pid: string): Promise<PetQrData> => {
  const response = await api.get(`/pets/${pid}/qr-data`);
  return response.data;
};

export const createPet = async (petData: FormData): Promise<Pet> => {
  const response = await api.post("/pets", petData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updatePet = async (
  pid: string,
  petData: FormData
): Promise<Pet> => {
  const response = await api.patch(`/pets/${pid}`, petData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deletePet = async (pid: string): Promise<void> => {
  await api.delete(`/pets/${pid}`);
};

export const getResponsibles = async (
  pid: string
): Promise<Responsible[]> => {
  const response = await api.get(`/pets/${pid}/responsibles`);
  return response.data;
};

export const addResponsible = async (
  pid: string,
  data: AddResponsibleRequest
): Promise<Responsible> => {
  const response = await api.post(`/pets/${pid}/responsibles`, data);
  return response.data;
};

export const removeResponsible = async (
  pid: string,
  userUid: string
): Promise<void> => {
  await api.delete(`/pets/${pid}/responsibles/${userUid}`);
};

export const getHealthRecords = async (
  pid: string,
  type?: string
): Promise<HealthRecord[]> => {
  const response = await api.get(`/pets/${pid}/health-records`, {
    params: type ? { type } : {},
  });

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.content ?? [];
};

export const getHealthRecordsPaginated = async ({
  pid,
  page = 0,
  size = 5,
  type,
}: HealthRecordPageParams): Promise<PageResponse<HealthRecord>> => {
  const response = await api.get(`/pets/${pid}/health-records`, {
    params: {
      page,
      size,
      type: type && type !== "ALL" ? type : undefined,
    },
  });

  return response.data;
};

export const createHealthRecord = async (
  pid: string,
  data: HealthRecordRequest
): Promise<HealthRecord> => {
  const response = await api.post(`/pets/${pid}/health-records`, data);
  return response.data;
};

export const updateHealthRecord = async (
  pid: string,
  recordId: number,
  data: HealthRecordRequest
): Promise<HealthRecord> => {
  const response = await api.patch(
    `/pets/${pid}/health-records/${recordId}`,
    data
  );

  return response.data;
};

export const deleteHealthRecord = async (
  pid: string,
  recordId: number
): Promise<void> => {
  await api.delete(`/pets/${pid}/health-records/${recordId}`);
};

export const getPublicPetById = async (pid: string): Promise<Pet> => {
  const response = await api.get(`/pets/public/${pid}`);
  return response.data;
};

export default api;
import axios, { AxiosError } from "axios";
import type {
  Experience,
  PromoValidationResponse,
  BookingRequest,
  BookingResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      throw new Error(
        "Cannot connect to server. Make sure the backend server is deployed"
      );
    }

    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message ||
        `Server error: ${error.response.status} ${error.response.statusText}`;
      throw new Error(message);
    }

    if (error.request) {
      // Request was made but no response received
      throw new Error(
        "No response from server. Please check your internet connection."
      );
    }

    // Something else happened
    throw new Error(error.message || "An unexpected error occurred");
  }
);

export const api = {
  async getExperiences(): Promise<Experience[]> {
    const response = await apiClient.get<Experience[]>("/experiences");
    return response.data;
  },

  async getExperienceById(id: string): Promise<Experience> {
    const response = await apiClient.get<Experience>(`/experiences/${id}`);
    return response.data;
  },

  async validatePromoCode(code: string): Promise<PromoValidationResponse> {
    const response = await apiClient.post<PromoValidationResponse>(
      "/promo/validate",
      { code }
    );
    return response.data;
  },

  async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>(
        "/bookings",
        bookingData
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific booking-related errors
        if (error.message.includes("Slot is sold out")) {
          throw new Error(
            "This time slot is sold out. Please choose a different time."
          );
        }
        if (error.message.includes("Invalid promo code")) {
          throw new Error("The promo code you entered is invalid or expired.");
        }
        if (error.message.includes("validation")) {
          throw new Error("Please check your booking details and try again.");
        }
      }
      throw error;
    }
  },
};

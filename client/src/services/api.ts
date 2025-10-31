import axios, { AxiosError } from "axios";
import { apiCache } from "./cache";
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
    const cacheKey = "experiences";

    // Check if data is in cache
    const cachedData = apiCache.get<Experience[]>(cacheKey);
    if (cachedData) {
      console.log("Returning experiences from cache");
      return cachedData;
    }

    // If not in cache, fetch from API
    console.log("Fetching experiences from API");
    const response = await apiClient.get<Experience[]>("/experiences");

    // Cache the data for 10 minutes
    apiCache.set(cacheKey, response.data, 10 * 60 * 1000);

    return response.data;
  },

  async getExperienceById(id: string): Promise<Experience> {
    const cacheKey = `experience_${id}`;

    // Check if data is in cache
    const cachedData = apiCache.get<Experience>(cacheKey);
    if (cachedData) {
      console.log(`Returning experience ${id} from cache`);
      return cachedData;
    }

    // If not in cache, fetch from API
    console.log(`Fetching experience ${id} from API`);
    const response = await apiClient.get<Experience>(`/experiences/${id}`);

    // Cache the data for 15 minutes
    apiCache.set(cacheKey, response.data, 15 * 60 * 1000);

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

      // Invalidate experiences cache after booking (availability might have changed)
      apiCache.delete("experiences");
      apiCache.delete(`experience_${bookingData.experienceId}`);

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

  // Cache management methods
  clearCache(): void {
    apiCache.clear();
    console.log("API cache cleared");
  },

  clearExperiencesCache(): void {
    apiCache.delete("experiences");
    console.log("Experiences cache cleared");
  },

  refreshExperiences(): Promise<Experience[]> {
    // Clear cache and fetch fresh data
    apiCache.delete("experiences");
    return this.getExperiences();
  },
};

export interface Slot {
  id: string;
  date: string; // DateTime as ISO string
  time: string; // e.g., "10:00 AM"
  totalTickets: number;
  bookedTickets: number;
  experienceId: string;
}

export interface Experience {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  slots?: Slot[];
}

export interface PromoDetails {
  type: "percentage" | "flat";
  value: number;
}

export interface PromoValidationResponse {
  message: string;
  promoDetails?: PromoDetails;
}

export interface BookingRequest {
  experienceId: string;
  slotId: string;
  userName: string;
  userEmail: string;
  finalPrice: number;
  promoCode?: string;
}

export interface BookingResponse {
  id: string;
  userName: string;
  userEmail: string;
  finalPrice: number;
  promoCode?: string;
  experienceId: string;
  slotId: string;
  promoDetails?: PromoDetails;
  originalPrice: number;
  discountApplied?: number;
}

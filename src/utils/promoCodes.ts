export const PROMO_CODES = {
  SAVE10: { type: "percentage" as const, value: 10 },
  FLAT100: { type: "fixed" as const, value: 100 },
  WELCOME20: { type: "percentage" as const, value: 20 },
  FLAT50: { type: "fixed" as const, value: 50 },
};

export type PromoCode = keyof typeof PROMO_CODES;
export type PromoDetails = (typeof PROMO_CODES)[PromoCode];

export const validatePromoCode = (code: string): PromoDetails | null => {
  const promo = PROMO_CODES[code.toUpperCase() as PromoCode];
  return promo || null;
};

export const calculateDiscountedPrice = (
  originalPrice: number,
  promoCode: string
): {
  discountedPrice: number;
  discountAmount: number;
  promoDetails: PromoDetails | null;
} => {
  const promo = validatePromoCode(promoCode);

  if (!promo) {
    return {
      discountedPrice: originalPrice,
      discountAmount: 0,
      promoDetails: null,
    };
  }

  let discountedPrice: number;
  let discountAmount: number;

  if (promo.type === "percentage") {
    discountAmount = (originalPrice * promo.value) / 100;
    discountedPrice = originalPrice - discountAmount;
  } else {
    discountAmount = Math.min(promo.value, originalPrice); // Don't discount more than the price
    discountedPrice = Math.max(0, originalPrice - promo.value);
  }

  return {
    discountedPrice,
    discountAmount,
    promoDetails: promo,
  };
};

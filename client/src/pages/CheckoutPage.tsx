import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { api } from "../services/api";
import type { PromoDetails } from "../types";

interface CheckoutPageProps {
  experienceId: string;
  slotId: string;
  quantity: number;
  basePrice: number;
  onBack: () => void;
  onSuccess: (bookingId: string) => void;
  onError: (message: string) => void;
}

export function CheckoutPage({
  experienceId,
  slotId,
  quantity,
  basePrice,
  onBack,
  onSuccess,
  onError,
}: CheckoutPageProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDetails, setPromoDetails] = useState<PromoDetails | null>(null);
  const [promoError, setPromoError] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const subtotal = basePrice;
  const discount = promoDetails
    ? promoDetails.type === "percentage"
      ? Math.round(subtotal * (promoDetails.value / 100))
      : promoDetails.value
    : 0;
  const afterDiscount = subtotal - discount;
  const taxes = Math.round(afterDiscount * 0.06);
  const total = afterDiscount + taxes;

  const validatePromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      setValidatingPromo(true);
      setPromoError("");
      const response = await api.validatePromoCode(promoCode);
      if (response.promoDetails) {
        setPromoDetails(response.promoDetails);
      } else {
        setPromoError("Invalid promo code");
      }
    } catch (err) {
      setPromoError("Invalid promo code");
    } finally {
      setValidatingPromo(false);
    }
  };

  const removePromo = () => {
    setPromoCode("");
    setPromoDetails(null);
    setPromoError("");
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!userName.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userEmail.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      //do this on owning to catch errors properly
      const response = await api.createBooking({
        experienceId,
        slotId,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        finalPrice: total,
        promoCode: promoCode.trim() || undefined,
      });
      onSuccess(response.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create booking";
      onError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="promo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="promo"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      disabled={!!promoDetails}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Enter promo code"
                    />
                    {!promoDetails ? (
                      <button
                        type="button"
                        onClick={validatePromo}
                        disabled={validatingPromo}
                        className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
                      >
                        {validatingPromo ? "Applying..." : "Apply"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={removePromo}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {promoError && (
                    <p className="mt-1 text-sm text-red-600">{promoError}</p>
                  )}
                  {promoDetails && (
                    <p className="mt-1 text-sm text-green-600">
                      Promo code applied successfully!{" "}
                      {promoDetails.type === "percentage"
                        ? `${promoDetails.value}% off`
                        : `₹${promoDetails.value} off`}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              >
                {submitting ? "Processing..." : "Complete Booking"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Price Summary
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Taxes (6%)</span>
                  <span>₹{taxes}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

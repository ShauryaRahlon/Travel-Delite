import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { api } from "../services/api";
import type { Experience, Slot } from "../types";

interface DetailsPageProps {
  experienceId: string;
  onBack: () => void;
  onConfirm: (
    experienceId: string,
    slotId: string,
    quantity: number,
    price: number
  ) => void;
}

export function DetailsPage({
  experienceId,
  onBack,
  onConfirm,
}: DetailsPageProps) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadExperience();
  }, [experienceId]);

  const loadExperience = async () => {
    try {
      setLoading(true);
      const data = await api.getExperienceById(experienceId);
      setExperience(data);

      if (data.slots && data.slots.length > 0) {
        const dates = [...new Set(data.slots.map((slot) => slot.date))];
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      }
    } catch (err) {
      setError("Failed to load experience details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const availableDates = experience?.slots
    ? [...new Set(experience.slots.map((slot) => slot.date))].sort()
    : [];

  const slotsForSelectedDate =
    experience?.slots?.filter((slot) => slot.date === selectedDate) || [];

  const subtotal = experience ? experience.price * quantity : 0;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (selectedSlot && experience) {
      onConfirm(experience.id, selectedSlot.id, quantity, total);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (timeStr: string) => {
    // Handle both 12-hour format (e.g., "10:00 AM") and 24-hour format (e.g., "10:00")
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      return timeStr; // Already in 12-hour format
    }

    // Convert 24-hour to 12-hour format
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch={false} />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || "Experience not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              src={
                experience.imageUrl ||
                "https://images.pexels.com/photos/1438404/pexels-photo-1438404.jpeg"
              }
              alt={experience.name}
              className="w-full h-96 object-cover rounded-lg"
            />

            <h1 className="text-3xl font-bold text-gray-900 mt-6">
              {experience.name}
            </h1>
            <p className="text-gray-600 mt-4">{experience.description}</p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Choose date
              </h2>
              <div className="flex flex-wrap gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      selectedDate === date
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Choose time
              </h2>
              <div className="flex flex-wrap gap-3">
                {slotsForSelectedDate.map((slot) => {
                  const availableTickets =
                    slot.totalTickets - slot.bookedTickets;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={availableTickets === 0}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors relative ${
                        selectedSlot?.id === slot.id
                          ? "bg-yellow-400 text-gray-900"
                          : availableTickets === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {formatTime(slot.time)}
                      {availableTickets > 0 && availableTickets <= 5 && (
                        <span className="ml-2 text-xs text-orange-600">
                          {availableTickets} left
                        </span>
                      )}
                      {availableTickets === 0 && (
                        <span className="ml-2 text-xs">Sold out</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            <div className="mt-8 bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                About
              </h2>
              <p className="text-gray-600 text-sm">
                Scenic routes, trained guides, and safety briefing. Minimum age
                10.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-600">Starts at</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{experience.price}
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>₹{taxes}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedSlot}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedSlot
                    ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import type { Experience } from "../types";

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: (id: string) => void;
}

export function ExperienceCard({
  experience,
  onViewDetails,
}: ExperienceCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={
            experience.imageUrl ||
            "https://images.pexels.com/photos/1438404/pexels-photo-1438404.jpeg"
          }
          alt={experience.name}
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {experience.name}
          </h3>
          {(experience as any).location && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {(experience as any).location}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">From </span>
            <span className="text-2xl font-bold text-gray-900">
              ₹{experience.price}
            </span>
          </div>
          <button
            onClick={() => onViewDetails(experience.id)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-md transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

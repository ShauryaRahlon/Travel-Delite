import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ExperienceCard } from '../components/ExperienceCard';
import { api } from '../services/api';
import type { Experience } from '../types';

interface HomePageProps {
  onNavigateToDetails: (id: string) => void;
}

export function HomePage({ onNavigateToDetails }: HomePageProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await api.getExperiences();
      setExperiences(data);
    } catch (err) {
      setError('Failed to load experiences. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-gray-600">Loading experiences...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onViewDetails={onNavigateToDetails}
              />
            ))}
          </div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No experiences available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}

import { MapPin } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  showSearch?: boolean;
}

export function Header({ onLogoClick, showSearch = true }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gray-900 text-white p-2 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-gray-900">highway</span>
              <span className="text-sm text-gray-600">delite</span>
            </div>
          </button>
          {showSearch && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search experiences"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-64"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-md transition-colors">
                Search
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

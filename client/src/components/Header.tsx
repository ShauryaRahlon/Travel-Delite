import { MapPin, Menu, X, Search } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onLogoClick?: () => void;
  showSearch?: boolean;
}

export function Header({ onLogoClick, showSearch = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Search */}
          {showSearch && (
            <div className="hidden md:flex items-center space-x-2">
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

          {/* Mobile menu button */}
          {showSearch && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Search Menu */}
        {showSearch && isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search experiences"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-4 rounded-md transition-colors text-base">
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

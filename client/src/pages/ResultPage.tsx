import { CheckCircle, XCircle } from 'lucide-react';
import { Header } from '../components/Header';

interface ResultPageProps {
  success: boolean;
  bookingId?: string;
  message?: string;
  onBackToHome: () => void;
}

export function ResultPage({ success, bookingId, message, onBackToHome }: ResultPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          {success ? (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-2">
                Your booking has been successfully confirmed.
              </p>
              {bookingId && (
                <p className="text-sm text-gray-500 mb-6">
                  Booking ID: <span className="font-mono font-medium">{bookingId}</span>
                </p>
              )}
              <p className="text-gray-600 mb-8">
                You will receive a confirmation email shortly with all the details.
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <XCircle className="w-20 h-20 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Failed</h1>
              <p className="text-gray-600 mb-8">
                {message || 'Something went wrong with your booking. Please try again.'}
              </p>
            </>
          )}

          <button
            onClick={onBackToHome}
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}

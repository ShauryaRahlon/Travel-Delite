import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { DetailsPage } from './pages/DetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ResultPage } from './pages/ResultPage';

type Page = 'home' | 'details' | 'checkout' | 'result';

interface BookingState {
  experienceId: string;
  slotId: string;
  quantity: number;
  price: number;
}

interface ResultState {
  success: boolean;
  bookingId?: string;
  message?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [bookingState, setBookingState] = useState<BookingState | null>(null);
  const [resultState, setResultState] = useState<ResultState | null>(null);

  const handleNavigateToDetails = (experienceId: string) => {
    setBookingState({ experienceId, slotId: '', quantity: 1, price: 0 });
    setCurrentPage('details');
  };

  const handleConfirmSlot = (
    experienceId: string,
    slotId: string,
    quantity: number,
    price: number
  ) => {
    setBookingState({ experienceId, slotId, quantity, price });
    setCurrentPage('checkout');
  };

  const handleBookingSuccess = (bookingId: string) => {
    setResultState({ success: true, bookingId });
    setCurrentPage('result');
  };

  const handleBookingError = (message: string) => {
    setResultState({ success: false, message });
    setCurrentPage('result');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setBookingState(null);
    setResultState(null);
  };

  const handleBackToDetails = () => {
    setCurrentPage('details');
  };

  const handleBackToHomePage = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onNavigateToDetails={handleNavigateToDetails} />
      )}
      {currentPage === 'details' && bookingState && (
        <DetailsPage
          experienceId={bookingState.experienceId}
          onBack={handleBackToHomePage}
          onConfirm={handleConfirmSlot}
        />
      )}
      {currentPage === 'checkout' && bookingState && (
        <CheckoutPage
          experienceId={bookingState.experienceId}
          slotId={bookingState.slotId}
          quantity={bookingState.quantity}
          basePrice={bookingState.price}
          onBack={handleBackToDetails}
          onSuccess={handleBookingSuccess}
          onError={handleBookingError}
        />
      )}
      {currentPage === 'result' && resultState && (
        <ResultPage
          success={resultState.success}
          bookingId={resultState.bookingId}
          message={resultState.message}
          onBackToHome={handleBackToHome}
        />
      )}
    </>
  );
}

export default App;

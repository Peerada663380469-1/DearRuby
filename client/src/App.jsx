import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import MenuPage from './pages/MenuPage';
import ReservationPage from './pages/ReservationPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import StoryPage from './pages/StoryPage';
import EventsPage from './pages/EventsPage';
// AdminDashboard removed as per user requirements
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import ReservationDetail from './pages/ReservationDetail';
import CustomerProfile from './pages/CustomerProfile';
import InvoicePage from './pages/InvoicePage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <Routes>
            {/* Customer Routes (Public) */}
            <Route path="/" element={<ReservationPage />} />
            <Route path="/checkout" element={<BookingCheckoutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/events" element={<EventsPage />} />
            
            {/* Admin Routes Removed */}

            {/* Customer Login & Dashboard */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/reservation/:id" element={<ReservationDetail />} />
            <Route path="/customer/profile/:customerId" element={<CustomerProfile />} />
            <Route path="/customer/invoice/:reservationId" element={<InvoicePage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}


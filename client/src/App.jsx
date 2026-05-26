import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import POSPage from './pages/POSPage';
import ReservationPage from './pages/ReservationPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import StoryPage from './pages/StoryPage';
import EventsPage from './pages/EventsPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <Routes>
            {/* Customer Routes (Public) */}
            <Route path="/" element={<ReservationPage />} />
            <Route path="/checkout" element={<BookingCheckoutPage />} />
            <Route path="/menu" element={<POSPage />} />
            <Route path="/pos" element={<POSPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/events" element={<EventsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

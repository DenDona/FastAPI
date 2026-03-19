import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RoomList from './components/rooms/RoomList';
import BookingList from './components/bookings/BookingList';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex gap-6">
          <Link to="/" className="font-bold text-lg">🏢 RoomBooking</Link>
          <Link to="/rooms" className="hover:text-blue-600">Комнаты</Link>
          <Link to="/bookings" className="hover:text-blue-600">Бронирования</Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<RoomList />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/bookings" element={<BookingList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
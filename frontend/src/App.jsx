import { Routes, Route, Link, useLocation } from 'react-router-dom'
import RoomList from './components/rooms/RoomList'
import BookingList from './components/bookings/BookingList'

function Navbar() {
  const location = useLocation()
  
  const navClass = (path) => 
    `px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path 
        ? 'bg-primary-600 text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏢</span>
              <span className="font-bold text-xl text-gray-800">RoomBooking</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className={navClass('/')}>
               Комнаты
            </Link>
            <Link to="/bookings" className={navClass('/bookings')}>
              📅 Бронирования
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<RoomList />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/bookings" element={<BookingList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
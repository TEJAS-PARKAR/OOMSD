import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchTrains from './pages/SearchTrains';
import SelectSeat from './pages/SelectSeat';
import BookingPayment from './pages/BookingPayment';
import Confirmation from './pages/Confirmation';
import PnrStatus from './pages/PnrStatus';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import DesignDocs from './pages/DesignDocs';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<SearchTrains />} />
            <Route path="/seats" element={<SelectSeat />} />
            <Route path="/payment" element={<BookingPayment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/pnr" element={<PnrStatus />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/design" element={<DesignDocs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

import React, { useState, useEffect } from 'react';
import { MapPin, Car, Clock, Navigation, CheckCircle, ShieldCheck } from 'lucide-react';
import './RideHailingPage.css';

const RideHailingPage = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rides, setRides] = useState([]);
  const [driverMode, setDriverMode] = useState(false);
  const [quote, setQuote] = useState(null);

  const handleGetQuote = (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;
    setQuote({
      distance: (Math.random() * 10 + 2).toFixed(1),
      price: Math.floor(Math.random() * 50000 + 20000),
      duration: Math.floor(Math.random() * 20 + 5)
    });
  };

  const handleBookRide = () => {
    const newRide = {
      id: Date.now(),
      pickup,
      dropoff,
      ...quote,
      status: 'pending',
      time: new Date().toLocaleTimeString()
    };
    setRides([newRide, ...rides]);
    setQuote(null);
    setPickup('');
    setDropoff('');
  };

  return (
    <div className="ride-hailing-container">
      <header className="rh-header">
        <div className="rh-header-content">
          <h1>EduConnect Rides</h1>
          <p>Safe and reliable transportation for students and tutors.</p>
          <button 
            className={`mode-toggle ${driverMode ? 'active' : ''}`}
            onClick={() => setDriverMode(!driverMode)}
          >
            {driverMode ? "Switch to Rider" : "Switch to Driver"}
          </button>
        </div>
      </header>

      <div className="rh-main">
        {!driverMode ? (
          <div className="rh-booking-section">
            <div className="rh-card booking-card">
              <h2>Book a Ride</h2>
              <form onSubmit={handleGetQuote}>
                <div className="input-group">
                  <MapPin size={20} className="input-icon text-blue-500" />
                  <input 
                    type="text" 
                    placeholder="Pickup Location" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <Navigation size={20} className="input-icon text-red-500" />
                  <input 
                    type="text" 
                    placeholder="Drop-off Location" 
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Get Fare Estimate</button>
              </form>

              {quote && (
                <div className="rh-quote">
                  <div className="quote-details">
                    <div className="quote-item">
                      <Car size={18} />
                      <span>{quote.distance} km</span>
                    </div>
                    <div className="quote-item">
                      <Clock size={18} />
                      <span>~{quote.duration} mins</span>
                    </div>
                    <div className="quote-price">
                      {quote.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                  <button onClick={handleBookRide} className="btn-success w-full mt-4">
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>

            <div className="rh-card history-card">
              <h2>My Recent Rides</h2>
              {rides.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No rides yet.</p>
              ) : (
                <ul className="ride-list">
                  {rides.map(r => (
                    <li key={r.id} className="ride-list-item">
                      <div className="ride-list-header">
                        <span className={`status-badge ${r.status}`}>{r.status}</span>
                        <span className="text-gray-500 text-sm">{r.time}</span>
                      </div>
                      <div className="ride-list-route">
                        <p><MapPin size={14} className="inline mr-1 text-blue-500"/> {r.pickup}</p>
                        <p><Navigation size={14} className="inline mr-1 text-red-500"/> {r.dropoff}</p>
                      </div>
                      <div className="ride-list-footer">
                        <span>{r.distance} km</span>
                        <span className="font-bold">{r.price.toLocaleString('vi-VN')} đ</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="rh-driver-section">
            <div className="rh-card driver-status">
              <h2><ShieldCheck size={24} className="inline mr-2 text-green-500"/> Driver Dashboard</h2>
              <div className="status-toggle">
                <span>Status: <strong>Online</strong></span>
                <div className="toggle-switch active"></div>
              </div>
              <div className="stats-grid">
                <div className="stat-box">
                  <h3>Rating</h3>
                  <p>4.9 ⭐</p>
                </div>
                <div className="stat-box">
                  <h3>Completed</h3>
                  <p>128 rides</p>
                </div>
              </div>
            </div>

            <div className="rh-card">
              <h2>Available Requests</h2>
              <p className="text-gray-500 text-center py-4">Looking for nearby requests...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHailingPage;

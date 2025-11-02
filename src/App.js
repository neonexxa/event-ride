import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, query, where, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [cars, setCars] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    passenger_name: '',
    passenger_email: '',
    pickup_point: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch all events (one-time fetch, events don't change often)
  useEffect(() => {
    fetchEvents();
  }, []);

  // Setup real-time listeners when event is selected
  useEffect(() => {
    let unsubscribe = null;
    
    if (selectedEvent) {
      // Fetch cars (one-time, cars don't change during event)
      fetchCars(selectedEvent);
      
      // Setup real-time listener for participants
      subscribeToParticipants(selectedEvent).then(unsub => {
        unsubscribe = unsub;
      });
      
      // Cleanup listener on unmount or event change
      return () => {
        if (unsubscribe) {
          console.log('🔌 Unsubscribing from participants listener');
          unsubscribe();
        }
      };
    } else {
      // Clear data when no event selected
      setCars([]);
      setParticipants([]);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Error loading events. Please check your Firebase configuration.');
    }
  };

  const fetchCars = async (eventId) => {
    try {
      setLoading(true);
      const q = query(collection(db, 'cars'), where('event_id', '==', eventId));
      const carsSnapshot = await getDocs(q);
      const carsData = carsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(carsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setLoading(false);
    }
  };

  // Real-time listener for participants
  const subscribeToParticipants = async (eventId) => {
    try {
      // First get all car IDs for this event
      const carsQuery = query(collection(db, 'cars'), where('event_id', '==', eventId));
      const carsSnapshot = await getDocs(carsQuery);
      const carIds = carsSnapshot.docs.map(doc => doc.id);
      
      if (carIds.length === 0) {
        setParticipants([]);
        return () => {}; // Return empty cleanup function
      }
      
      // Listen to ALL participants changes in real-time
      const participantsQuery = collection(db, 'participants');
      const unsubscribe = onSnapshot(participantsQuery, (snapshot) => {
        const participantsData = snapshot.docs
          .filter(doc => carIds.includes(doc.data().car_id))
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        
        setParticipants(participantsData);
        console.log('🔄 Real-time update: Participants refreshed');
      }, (error) => {
        console.error('Error in participants listener:', error);
      });
      
      // Return the unsubscribe function for cleanup
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up participants listener:', error);
      return () => {}; // Return empty cleanup function on error
    }
  };

  const handleSeatClick = (carId, seatNumber) => {
    const isOccupied = participants.some(
      p => p.car_id === carId && p.seat_number === seatNumber
    );
    
    if (isOccupied) {
      // Handle cancellation
      const participant = participants.find(
        p => p.car_id === carId && p.seat_number === seatNumber
      );
      if (window.confirm(`Cancel booking for ${participant.passenger_name}?`)) {
        cancelBooking(participant.id);
      }
    } else {
      // Book seat
      setSelectedSeat({ carId, seatNumber });
      setShowModal(true);
    }
  };

  const cancelBooking = async (participantId) => {
    try {
      await deleteDoc(doc(db, 'participants', participantId));
      // Real-time listener will automatically update the UI
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking. Please try again.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.passenger_name || !formData.passenger_email || !formData.pickup_point) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'participants'), {
        car_id: selectedSeat.carId,
        seat_number: selectedSeat.seatNumber,
        passenger_name: formData.passenger_name,
        passenger_email: formData.passenger_email,
        pickup_point: formData.pickup_point
      });

      setShowModal(false);
      setFormData({ passenger_name: '', passenger_email: '', pickup_point: '' });
      setSelectedSeat(null);
      // Real-time listener will automatically update the UI
      alert('Seat booked successfully!');
    } catch (error) {
      console.error('Error booking seat:', error);
      alert('Error booking seat. Please try again.');
    }
  };

  const getSeatStatus = (carId, seatNumber) => {
    return participants.find(p => p.car_id === carId && p.seat_number === seatNumber);
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🚗 Carpool Seat Selection</h1>
        
        <div className="event-selector">
          <label htmlFor="event-select">Select Event:</label>
          <select
            id="event-select"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="event-dropdown"
          >
            <option value="">-- Select an Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} - {event.date} ({event.startTime} - {event.endTime})
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="loading">Loading cars...</div>}

        {selectedEvent && !loading && (
          <div className="cars-grid">
            {cars.length === 0 ? (
              <div className="no-cars">No cars available for this event</div>
            ) : (
              cars.map((car) => (
                <div key={car.id} className="car-card">
                  <div className="car-header">
                    <h3>🚙 {car.driver_name}</h3>
                    <div className="car-info">
                      <p>⏰ {car.depart_time}</p>
                      <p>📍 {car.meetup_point}</p>
                    </div>
                  </div>
                  <div className="seats-container">
                    {[...Array(car.seats_count)].map((_, index) => {
                      const seatNumber = index + 1;
                      const seatInfo = getSeatStatus(car.id, seatNumber);
                      const isOccupied = !!seatInfo;
                      
                      return (
                        <button
                          key={seatNumber}
                          className={`seat ${isOccupied ? 'occupied' : 'available'}`}
                          onClick={() => handleSeatClick(car.id, seatNumber)}
                          title={isOccupied ? `Booked by ${seatInfo.passenger_name}` : 'Available'}
                        >
                          <span className="seat-number">{seatNumber}</span>
                          {isOccupied && <span className="seat-label">{seatInfo.passenger_name}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {!selectedEvent && !loading && (
          <div className="no-selection">
            Please select an event to view available cars
          </div>
        )}

        {/* Booking Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Book Seat</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.passenger_name}
                    onChange={(e) => setFormData({...formData, passenger_name: e.target.value})}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.passenger_email}
                    onChange={(e) => setFormData({...formData, passenger_email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pickup Point:</label>
                  <input
                    type="text"
                    value={formData.pickup_point}
                    onChange={(e) => setFormData({...formData, pickup_point: e.target.value})}
                    placeholder="Enter pickup location"
                    required
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="btn-submit">Book Seat</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-box available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box occupied"></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
}

export default App;


import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Map, MapPin, Search } from 'lucide-react';

export default function Locations() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = [
    { id: 'room-a', name: 'Classroom A', floor: 'Floor 1', type: 'Hacking Area' },
    { id: 'room-b', name: 'Classroom B', floor: 'Floor 1', type: 'Quiet Zone' },
    { id: 'room-c', name: 'Classroom C', floor: 'Floor 2', type: 'Workshops' },
    { id: 'cafe', name: 'Cafeteria', floor: 'Floor 1', type: 'Food & Drinks' },
    { id: 'lobby', name: 'Main Lobby', floor: 'Ground', type: 'Help Desk / Mentors' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Venue <span className="text-gradient">Map</span></h1>
        <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <Map size={20} />
        </button>
      </div>

      {/* Search / Filter (Visual only) */}
      <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Find a room, mentor, or pizza..." 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'white', 
            width: '100%',
            outline: 'none',
            fontFamily: 'Inter'
          }} 
        />
      </div>

      {selectedRoom ? (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>{selectedRoom.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedRoom.floor} • {selectedRoom.type}</p>
          
          <div className="qr-display" style={{ border: '2px solid var(--neon-cyan)' }}>
            <QRCodeSVG 
              value={`hackathon-location:${selectedRoom.id}`} 
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#0a0a0f"}
              level={"Q"}
            />
          </div>
          
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: '1.5rem' }}>
            Scan at the door to check-in and earn 50 points.
          </p>
          
          <button className="btn btn-primary" onClick={() => setSelectedRoom(null)} style={{ width: '100%' }}>
            Back to Directory
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Directory
          </h3>
          {rooms.map(room => (
            <div 
              key={room.id} 
              className="glass-panel location-card" 
              onClick={() => setSelectedRoom(room)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{room.name}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="location-tag" style={{ margin: 0, background: 'rgba(157, 0, 255, 0.1)', color: 'var(--neon-purple)' }}>
                    {room.floor}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{room.type}</span>
                </div>
              </div>
              <MapPin color="var(--neon-cyan)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

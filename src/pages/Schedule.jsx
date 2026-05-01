import { MapPin, Coffee, Code, Trophy, Pizza } from 'lucide-react';

export default function Schedule() {
  const events = [
    { id: 1, time: '09:00 AM', title: 'Check-in & Breakfast', location: 'Main Lobby', icon: <Coffee size={20} />, active: false },
    { id: 2, time: '10:00 AM', title: 'Opening Ceremony', location: 'Auditorium', icon: <Trophy size={20} />, active: false },
    { id: 3, time: '11:00 AM', title: 'Hacking Begins', location: 'All Classrooms', icon: <Code size={20} />, active: true },
    { id: 4, time: '01:00 PM', title: 'Lunch Break', location: 'Cafeteria, Floor 1', icon: <Pizza size={20} />, active: false },
    { id: 5, time: '04:00 PM', title: 'Mini-Event: Typing Contest', location: 'Room B', icon: <Code size={20} />, active: false },
    { id: 6, time: '07:00 PM', title: 'Dinner', location: 'Cafeteria, Floor 1', icon: <Pizza size={20} />, active: false },
    { id: 7, time: '12:00 AM', title: 'Midnight Snack', location: 'Lobby', icon: <Coffee size={20} />, active: false },
  ];

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '1rem' }}>Event <span className="text-gradient">Schedule</span></h1>
      
      <div className="timeline">
        {events.map((event) => (
          <div key={event.id} className={`timeline-item ${event.active ? 'active' : ''}`}>
            <div className="timeline-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {event.icon}
            </div>
            <div className="timeline-content">
              <div className="timeline-time">{event.time}</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{event.title}</h3>
              <div className="location-tag">
                <MapPin size={12} /> {event.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

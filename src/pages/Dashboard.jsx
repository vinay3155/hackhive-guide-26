import { useState, useEffect } from 'react';
import { Clock, Users, Zap, Terminal } from 'lucide-react';

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // Simple simulation of a countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '0.5rem' }}>Welcome, <span className="text-gradient">Hacker</span></h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Stay updated with the latest events and map.</p>

      {/* Current Event Highlights */}
      <div className="current-event-card glass-panel" style={{ borderRadius: '16px' }}>
        <div className="event-badge animate-pulse-glow">Happening Now</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Building Phase</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Get your environments set up and start coding. Mentors are available in the central hall.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="location-tag" style={{ margin: 0 }}>
            <Terminal size={14} /> Main Floor
          </div>
          <div className="location-tag" style={{ margin: 0 }}>
            <Clock size={14} /> Ends in 8h
          </div>
        </div>
      </div>

      {/* Stats / Actions Grid */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Time Remaining</span>
            <Clock size={20} color="var(--neon-cyan)" />
          </div>
          <div className="stat-value text-gradient">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Your Points</span>
            <Zap size={20} color="var(--neon-purple)" />
          </div>
          <div className="stat-value text-gradient-pink">1,250</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top 10% of hackers. Keep scanning!</p>
        </div>
      </div>
    </div>
  );
}

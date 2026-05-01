import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, Cpu } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target to May 6, 2026 9:00 AM
    const targetDate = new Date('2026-05-06T09:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome to <span className="text-gradient">Hackathon</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select your track to view schedule, locations, and guidelines.</p>
      </div>

      <div className="countdown-container">
        <div className="countdown-box">
          <div className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="countdown-label">Mins</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="countdown-label">Secs</div>
        </div>
      </div>

      <div className="track-selection">
        <Link to="/track/software" className="track-card">
          <div className="track-icon-wrapper" style={{ color: 'var(--neon-cyan)', background: 'rgba(0, 243, 255, 0.1)' }}>
            <Code size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Software Track</h2>
          <p style={{ color: 'var(--text-muted)' }}>Web & App Development. View your specialized schedule, rooms, and judging criteria.</p>
        </Link>

        <Link to="/track/hardware" className="track-card">
          <div className="track-icon-wrapper" style={{ color: 'var(--neon-purple)', background: 'rgba(157, 0, 255, 0.1)' }}>
            <Cpu size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Hardware Track</h2>
          <p style={{ color: 'var(--text-muted)' }}>IoT & Embedded Systems. View your specialized schedule, labs, and judging criteria.</p>
        </Link>
      </div>
    </div>
  );
}

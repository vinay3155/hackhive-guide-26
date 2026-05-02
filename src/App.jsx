import { useState, useEffect } from 'react';
import WhereToGo from './components/sections/WhereToGo';
import Schedule from './components/sections/Schedule';
import Food from './components/sections/Food';
import Rounds from './components/sections/Rounds';
import Challenges from './components/sections/Challenges';
import Feedback from './components/sections/Feedback';
import OrganizerDashboard from './pages/OrganizerDashboard';
import './index.css';

const START = new Date('2026-05-06T08:00:00');
const END   = new Date('2026-05-07T08:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

export default function App() {
  if (window.location.pathname === '/organizer') {
    return <OrganizerDashboard />;
  }

  const [activeTab, setActiveTab] = useState('where');
  const [now, setNow] = useState(new Date());

  // Participant State
  const [participantId, setParticipantId] = useState(localStorage.getItem('participantId'));
  const [teamName, setTeamName] = useState('');
  const [phone, setPhone] = useState('');
  const [trackInput, setTrackInput] = useState('hardware');
  const [status, setStatus] = useState({ checkedIn: false, exitStatus: 'none', track: 'hardware', hasActiveSos: false, challengesReleased: false, selectedChallenge: null });
  const [showSosMenu, setShowSosMenu] = useState(false);
  const [showExitForm, setShowExitForm] = useState(false);
  const [exitReason, setExitReason] = useState('');

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll status if registered
  useEffect(() => {
    if (!participantId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/status/${participantId}`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        } else {
          // ID not found on server (server restarted?), clear it
          localStorage.removeItem('participantId');
          setParticipantId(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [participantId]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!teamName || !phone) return alert("Please fill all fields");

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, phone, track: trackInput })
      });
      const data = await res.json();
      localStorage.setItem('participantId', data.id);
      setParticipantId(data.id);
      setStatus(prev => ({ ...prev, track: trackInput }));
    } catch (err) {
      console.error(err);
      alert("Registration failed. Backend might not be running.");
    }
  };

  const handleCheckIn = async () => {
    try {
      await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: participantId })
      });
      setStatus(prev => ({ ...prev, checkedIn: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExitRequest = async (e) => {
    e?.preventDefault();
    if (!exitReason) return alert("Please enter a reason for exiting.");

    try {
      await fetch('/api/exit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: participantId, reason: exitReason })
      });
      setStatus(prev => ({ ...prev, exitStatus: 'pending' }));
      setShowExitForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSos = async (type) => {
    try {
      await fetch('/api/sos-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: participantId, type })
      });
      setStatus(prev => ({ ...prev, hasActiveSos: true }));
      setShowSosMenu(false);
    } catch (err) {
      console.error(err);
    }
  };

  let diff, phase;
  if (now < START) {
    diff = START.getTime() - now.getTime();
    phase = 'pre';
  } else if (now >= START && now < END) {
    diff = END.getTime() - now.getTime();
    phase = 'live';
  } else {
    diff = 0;
    phase = 'done';
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const pct = phase === 'pre' ? 0 : phase === 'done' ? 100 : Math.min(100, ((now.getTime() - START.getTime()) / (END.getTime() - START.getTime()) * 100)).toFixed(1);
  const elapsed = now.getTime() - START.getTime();
  const eh = Math.max(0, Math.floor(elapsed / 3600000));
  const em = Math.max(0, Math.floor((elapsed % 3600000) / 60000));

  // --- REGISTRATION MODAL ---
  if (!participantId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--ink)' }}>
        <form onSubmit={handleRegister} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', marginBottom: '1rem', color: 'var(--ink)' }}>Welcome, hackhive2k26!</h2>
          <p style={{ color: 'var(--ink3)', marginBottom: '1.5rem', fontSize: '14px' }}>Please register your device to check-in and access the guide.</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink2)', marginBottom: '4px' }}>Team Name</label>
            <input 
              type="text" 
              required
              value={teamName} 
              onChange={e => setTeamName(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--rule)', fontSize: '16px' }} 
              placeholder="e.g. ByteMe"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink2)', marginBottom: '4px' }}>Team Leader Mobile No.</label>
            <input 
              type="tel" 
              required
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--rule)', fontSize: '16px' }} 
              placeholder="123-456-7890"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink2)', marginBottom: '8px' }}>Select Your Track</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid var(--rule)', borderRadius: '8px', cursor: 'pointer', background: trackInput === 'hardware' ? 'var(--hw-bg)' : '#fff' }}>
                <input type="radio" name="track" value="hardware" checked={trackInput === 'hardware'} onChange={() => setTrackInput('hardware')} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Hardware</span>
              </label>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid var(--rule)', borderRadius: '8px', cursor: 'pointer', background: trackInput === 'software' ? 'var(--sw-bg)' : '#fff' }}>
                <input type="radio" name="track" value="software" checked={trackInput === 'software'} onChange={() => setTrackInput('software')} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Software</span>
              </label>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', background: '#4ADE80', color: '#15803D', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Register Device
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      {/* ── HEADER ── */}
      <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '0', background: 'var(--bg)' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '0.08em', color: 'var(--ink)' }}>
          ANGADI INSTITUTE OF TECHNOLOGY AND MANAGEMENT
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '0.15em', fontWeight: '600', color: 'var(--ink3)', textTransform: 'uppercase', marginTop: '4px' }}>
          Organised by Electronics & Communication Department
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="marquee-container">
        <div className="marquee-content">
          🚨 IMPORTANT NOTE: All participants must bring their college ID cards for verification! 🚨
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero" style={{ paddingTop: '1.5rem' }}>
        <div className="hero-eyebrow">
          <div className="hero-dot"></div>
          <span>{phase === 'pre' ? 'Countdown Active' : phase === 'live' ? 'Hackathon is Live!' : 'Hackathon Complete'}</span>
        </div>
        <div className="hero-title">HackHive<span>Guide</span><br/>26</div>
        
        {/* INTERACTIVE ACTIONS */}
        <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          {!status.checkedIn ? (
            <button onClick={handleCheckIn} style={{ background: '#4ADE80', color: '#15803D', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 I've Entered the College
            </button>
          ) : (
            <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: '#4ADE80', fontWeight: 'bold', fontSize: '14px' }}>✅ Checked In</div>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {status.exitStatus === 'none' && !showExitForm && (
                  <button onClick={() => setShowExitForm(true)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                    🚶 Request Exit
                  </button>
                )}

                {showExitForm && (
                  <form onSubmit={handleExitRequest} style={{ width: '100%', display: 'flex', gap: '8px', flexDirection: 'column', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Why do you need to leave?" 
                      value={exitReason}
                      onChange={e => setExitReason(e.target.value)}
                      required
                      style={{ padding: '10px', borderRadius: '6px', border: 'none', fontSize: '14px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" style={{ flex: 1, background: '#3B82F6', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Request</button>
                      <button type="button" onClick={() => setShowExitForm(false)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </form>
                )}
                
                {status.exitStatus === 'pending' && (
                  <div style={{ flex: 1, background: 'var(--warn)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                    ⏳ Exit Pending Approval...
                  </div>
                )}
                
                {status.exitStatus === 'granted' && (
                  <div style={{ flex: 1, background: '#3B82F6', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                    ✅ Exit GRANTED
                  </div>
                )}

                {/* SOS SYSTEM */}
                {!status.hasActiveSos ? (
                  <div style={{ flex: 1, position: 'relative' }}>
                    <button onClick={() => setShowSosMenu(!showSosMenu)} style={{ width: '100%', background: '#EF4444', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
                      🆘 Get Help
                    </button>
                    {showSosMenu && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10 }}>
                        <button onClick={() => handleSos('mentor')} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', borderBottom: '1px solid #eee', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: 'var(--ink)', cursor: 'pointer' }}>
                          💬 Need a Mentor
                        </button>
                        <button onClick={() => handleSos('emergency')} style={{ width: '100%', padding: '12px', background: '#FEF2F2', border: 'none', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#DC2626', cursor: 'pointer' }}>
                          🚨 MEDICAL EMERGENCY
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                   <div style={{ flex: 1, background: '#F59E0B', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                    🚨 Help is on the way!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="live-bar">
          <div>
            <div className="lb-label">{phase === 'pre' ? 'Starts in' : phase === 'live' ? 'Time left' : 'Status'}</div>
            <div className="lb-val">
              {phase === 'done' ? 'Finished!' : `${Math.floor(diff / 3600000)}h ${pad(m)}m`}
            </div>
          </div>
          <div className="lb-status">
            <div className="hero-dot" style={{ background: phase === 'done' ? '#8C867E' : '#4ADE80' }}></div>
            <span>{phase === 'pre' ? 'Upcoming' : phase === 'live' ? 'Live Now' : 'Ended'}</span>
          </div>
        </div>
      </div>

      {/* ── COUNTDOWN ── */}
      <div className="countdown-section">
        <div className="section-eyebrow">
          {phase === 'pre' ? 'Time until hackathon begins' : phase === 'live' ? 'Time remaining to submit' : 'Hackathon has ended'}
        </div>
        <div className="cd-row">
          <div className="cd-unit-block">
            <span className="cd-number">{phase === 'done' ? '00' : d}</span>
            <div className="cd-unit-name">Days</div>
          </div>
          <div className="cd-unit-block">
            <span className="cd-number">{phase === 'done' ? '00' : pad(h)}</span>
            <div className="cd-unit-name">Hours</div>
          </div>
          <div className="cd-unit-block">
            <span className="cd-number">{phase === 'done' ? '00' : pad(m)}</span>
            <div className="cd-unit-name">Min</div>
          </div>
          <div className="cd-unit-block">
            <span className="cd-number">{phase === 'done' ? '00' : pad(s)}</span>
            <div className="cd-unit-name">Sec</div>
          </div>
        </div>
        <div className={`cd-message ${phase === 'pre' ? 'cd-msg-pre' : phase === 'live' ? 'cd-msg-live' : 'cd-msg-done'}`}>
          {phase === 'pre' && '🚀 Get ready! The hackathon kicks off on May 6 at 8:00 AM.'}
          {phase === 'live' && '🔥 Hacking is LIVE! Go build something amazing.'}
          {phase === 'done' && '🎉 HackHive Guide 26 is complete! Congratulations to all participants!'}
        </div>
      </div>

      {/* ── PROGRESS ── */}
      <div className="progress-section">
        <div className="section-eyebrow">Hackathon Progress — May 6, 8AM → May 7, 8AM</div>
        <div className="prog-track">
          <div className="prog-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="prog-labels">
          <span>Day 1 · 8:00 AM</span>
          <span>
            {phase === 'pre' ? 'Not started yet' : phase === 'live' ? `${eh}h ${em}m elapsed · ${pct}%` : 'Completed!'}
          </span>
          <span>Day 2 · 8:00 AM</span>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'where' ? 'active' : ''}`} onClick={() => setActiveTab('where')}>📍 Where to Go</button>
        <button className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>📅 Schedule</button>
        <button className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>💻 Challenges</button>
        <button className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>🍽 Food</button>
        <button className={`tab-btn ${activeTab === 'rounds' ? 'active' : ''}`} onClick={() => setActiveTab('rounds')}>🏆 Rounds</button>
        <button className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>⭐ Feedback</button>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="tab-section active">
        {activeTab === 'where' && <WhereToGo track={status.track} />}
        {activeTab === 'schedule' && <Schedule now={now} />}
        {activeTab === 'challenges' && <Challenges track={status.track} challengesReleased={status.challengesReleased} selectedChallenge={status.selectedChallenge} participantId={participantId} />}
        {activeTab === 'food' && <Food now={now} />}
        {activeTab === 'rounds' && <Rounds now={now} />}
        {activeTab === 'feedback' && <Feedback teamName={teamName} />}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ 
        marginTop: '3rem', 
        padding: '2rem 1.5rem', 
        background: "#0d1117", 
        borderTop: '1px solid var(--rule)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderRadius: '16px 16px 0 0'
      }}>
        {/* Left Side: Instagram */}
        <a 
          href="https://www.instagram.com/aitm_hackhive?igsh=MTZqNmMyZjNtaTdjaw==" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            textDecoration: 'none', 
            color: 'var(--ink)',
            padding: '8px 12px',
            background: '#fff',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E1306C' }}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>@aitm_hackhive</span>
        </a>

        {/* Right Side: Credits */}
        <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--ink3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--ink2)' }}>© 2026 HackHive AITM</div>
          <div style={{ marginTop: '4px' }}>CRAFTED WITH ❤️ BY VINAY BODRAVLA</div>
        </div>
      </footer>
    </>
  );
}


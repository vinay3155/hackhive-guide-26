import { useState, useEffect } from 'react';
import '../index.css';

export default function OrganizerDashboard() {
  const [stats, setStats] = useState({ hwCheckedIn: 0, swCheckedIn: 0, pendingExits: [], processedExits: [], sosAlerts: [] });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/organizer/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, []);

  const handleRespond = async (id, status) => {
    try {
      await fetch('/api/organizer/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveSos = async (id) => {
    try {
      await fetch('/api/organizer/resolve-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', marginBottom: '1rem' }}>
        Organizer <span style={{ color: '#4ADE80' }}>Dashboard</span>
      </h1>

      {/* SOS ALERTS */}
      {stats.sosAlerts.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '1rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ animation: 'pulse 1.5s infinite' }}>🚨</span> ACTIVE SOS ALERTS
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {stats.sosAlerts.map(req => {
              const isEmergency = req.sosRequest.type === 'emergency';
              const bgColor = isEmergency ? '#FEF2F2' : '#FEFCE8';
              const borderColor = isEmergency ? '#EF4444' : '#F59E0B';
              const textColor = isEmergency ? '#B91C1C' : '#D97706';

              return (
                <div key={req.id} style={{ background: bgColor, padding: '1.25rem', borderRadius: '12px', border: `2px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: textColor, textTransform: 'uppercase', marginBottom: '4px' }}>
                      {isEmergency ? 'MEDICAL EMERGENCY' : 'Mentor Requested'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{req.teamName} <span style={{ color: 'var(--ink3)' }}>({req.track})</span></div>
                    <div style={{ fontSize: '14px', color: 'var(--ink2)' }}>📱 {req.phone}</div>
                  </div>
                  <button 
                    onClick={() => handleResolveSos(req.id)}
                    style={{ padding: '12px 24px', background: borderColor, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    Mark Resolved ✅
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATS OVERVIEW */}
      <h2 style={{ fontSize: '20px', marginBottom: '1rem' }}>Live Check-ins</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFF1EE', padding: '1.5rem', borderRadius: '12px', border: '1px solid #FFCCC7' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#D4380D', letterSpacing: '0.1em', fontWeight: 'bold' }}>Hardware Teams</div>
          <div style={{ fontSize: '48px', fontFamily: "'Bebas Neue', sans-serif", color: '#D4380D' }}>{stats.hwCheckedIn}</div>
        </div>
        <div style={{ background: '#E6F4FF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #91CAFF' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#096DD9', letterSpacing: '0.1em', fontWeight: 'bold' }}>Software Teams</div>
          <div style={{ fontSize: '48px', fontFamily: "'Bebas Neue', sans-serif", color: '#096DD9' }}>{stats.swCheckedIn}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--ink3)', letterSpacing: '0.1em', fontWeight: 'bold' }}>Pending Exits</div>
          <div style={{ fontSize: '48px', fontFamily: "'Bebas Neue', sans-serif", color: 'var(--warn)' }}>{stats.pendingExits.length}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '1rem' }}>Pending Exit Requests</h2>
      {stats.pendingExits.length === 0 ? (
        <p style={{ color: 'var(--ink3)' }}>No pending exit requests.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {stats.pendingExits.map(req => (
            <div key={req.id} style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--warn)' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{req.teamName} <span style={{ fontSize: '14px', color: 'var(--ink3)', fontWeight: 'normal' }}>({req.track})</span></div>
              <div style={{ fontSize: '14px', color: 'var(--ink2)', marginBottom: '8px' }}>📱 {req.phone}</div>
              <div style={{ fontSize: '14px', background: '#FFFBEB', color: '#B45309', padding: '8px', borderRadius: '6px', marginBottom: '12px', border: '1px solid #FEF3C7' }}>
                <strong>Reason:</strong> {req.exitReason || 'No reason provided'}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleRespond(req.id, 'granted')}
                  style={{ flex: 1, padding: '10px', background: '#4ADE80', color: '#15803D', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Grant Exit ✅
                </button>
                <button 
                  onClick={() => handleRespond(req.id, 'rejected')}
                  style={{ flex: 1, padding: '10px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Reject ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

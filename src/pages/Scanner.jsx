import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle } from 'lucide-react';

export default function Scanner() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    // Only initialize scanner if we haven't scanned anything yet
    if (!scanResult) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
      });

      scanner.render(
        (result) => {
          scanner.clear();
          setScanResult(result);
        },
        (error) => {
          // ignore background errors
        }
      );

      return () => {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      };
    }
  }, [scanResult]);

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>QR <span className="text-gradient">Scanner</span></h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Scan location codes to check-in and earn points.
        </p>
      </div>

      {scanResult ? (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(0, 243, 255, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.4)'
          }}>
            <CheckCircle size={40} color="var(--neon-cyan)" />
          </div>
          
          <h2 style={{ marginBottom: '0.5rem' }}>Check-in Successful!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Code Data: <span style={{ color: 'white' }}>{scanResult}</span>
          </p>
          
          <div className="stat-card glass-panel" style={{ width: '100%', marginBottom: '2rem' }}>
            <span className="stat-title">Points Earned</span>
            <div className="stat-value text-gradient-pink">+50 XP</div>
          </div>

          <button className="btn btn-primary" onClick={() => setScanResult(null)} style={{ width: '100%' }}>
            Scan Another Code
          </button>
        </div>
      ) : (
        <div className="scanner-container">
          <div id="reader" style={{ width: '100%', border: 'none' }}></div>
          <div className="scanner-overlay">
            <div className="scan-line"></div>
          </div>
        </div>
      )}

      {!scanResult && (
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <Camera size={20} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
          Point your camera at any Hackathon QR code.
        </div>
      )}
    </div>
  );
}

export default function WhereToGo({ track }) {
  return (
    <>
      {/* HARDWARE */}
      {track === 'hardware' && (
      <div className="venue-card">
        <div className="venue-header">
          <div>
            <span className="venue-track-tag vt-hw">⚡ Hardware Track</span>
            <div className="venue-name">Rooms 101 – 105</div>
            <div className="venue-dept">Electronics & Communication Department</div>
          </div>
        </div>
        <div className="venue-body">
          <div className="venue-row">
            <div className="venue-icon">🏢</div>
            <div>
              <div className="venue-row-label">Floor</div>
              <div className="venue-row-val">2nd Floor — EC Department Block</div>
            </div>
          </div>
          <div className="venue-row">
            <div className="venue-icon">🚪</div>
            <div>
              <div className="venue-row-label">Room Numbers</div>
              <div className="venue-row-val">101, 102, 103, 104, 105</div>
            </div>
          </div>
          <div className="venue-row">
            <div className="venue-icon">🔧</div>
            <div>
              <div className="venue-row-label">Track Type</div>
              <div className="venue-row-val">Hardware, IoT, Embedded Systems, Robotics</div>
            </div>
          </div>
          <div className="venue-row">
            <div className="venue-icon">⏰</div>
            <div>
              <div className="venue-row-label">Opens</div>
              <div className="venue-row-val">May 6 at 8:00 AM — doors open for all participants</div>
            </div>
          </div>

          <div className="directions-box">
            <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '10px' }}>How to reach</div>
            <div className="dir-step">
              <div className="dir-num">1</div>
              <div className="dir-text">Enter through the college main gate and head towards the EC Department building.</div>
            </div>
            <div className="dir-step">
              <div className="dir-num">2</div>
              <div className="dir-text">Take the staircase up to the <strong>2nd floor</strong>.</div>
            </div>
            <div className="dir-step">
              <div className="dir-num">3</div>
              <div className="dir-text">You'll find rooms 101 to 105 on the right side of the corridor.</div>
            </div>
            <div className="dir-step">
              <div className="dir-num">4</div>
              <div className="dir-text">Look for HackHive Guide 26 banners — a volunteer will be stationed at the entrance.</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* SOFTWARE */}
      {track === 'software' && (
      <div className="venue-card">
        <div className="venue-header">
          <div>
            <span className="venue-track-tag vt-sw">💻 Software Track</span>
            <div className="venue-name">KTech Lab</div>
            <div className="venue-dept">Near the Amphitheater</div>
          </div>
        </div>
        <div className="venue-body">
          <div className="venue-row">
            <div className="venue-icon">🏢</div>
            <div>
              <div className="venue-row-label">Floor</div>
              <div className="venue-row-val">1st Floor (Ground Level)</div>
            </div>
          </div>
          <div className="venue-row">
            <div className="venue-icon">📍</div>
            <div>
              <div className="venue-row-label">Landmark</div>
              <div className="venue-row-val">Adjacent to the Amphitheater</div>
            </div>
          </div>
          <div className="venue-row">
            <div className="venue-icon">💡</div>
            <div>
              <div className="venue-row-label">Track Type</div>
              <div className="venue-row-val">Web Dev, App Dev, AI/ML, Cybersecurity</div>
            </div>
          </div>
          <div className="venue-row">
            <div className="venue-icon">⏰</div>
            <div>
              <div className="venue-row-label">Opens</div>
              <div className="venue-row-val">May 6 at 8:00 AM — big hall, no room numbers</div>
            </div>
          </div>

          <div className="directions-box">
            <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '10px' }}>How to reach</div>
            <div className="dir-step">
              <div className="dir-num">1</div>
              <div className="dir-text">Enter the college and walk straight towards the Amphitheater area.</div>
            </div>
            <div className="dir-step">
              <div className="dir-num">2</div>
              <div className="dir-text">KTech Lab is the <strong>large hall right next to the Amphitheater</strong> on the ground floor.</div>
            </div>
            <div className="dir-step">
              <div className="dir-num">3</div>
              <div className="dir-text">Follow the HackHive Guide 26 directional signs — you can't miss it.</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* CAFETERIA */}
      <div className="venue-card">
        <div className="venue-header">
          <div>
            <span className="venue-track-tag vt-food">🍱 Food Zone</span>
            <div className="venue-name">Cafeteria</div>
            <div className="venue-dept">Beside the Playground</div>
          </div>
        </div>
        <div className="venue-body">
          <div className="venue-row">
            <div className="venue-icon">📍</div>
            <div>
              <div className="venue-row-label">Location</div>
              <div className="venue-row-val">Right beside the college playground</div>
            </div>
          </div>
          <div className="venue-row">
            <div className="venue-icon">🕐</div>
            <div>
              <div className="venue-row-label">Open Hours</div>
              <div className="venue-row-val">Available throughout the 24 hours for all meals & snacks</div>
            </div>
          </div>
          <div className="directions-box">
            <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '10px' }}>How to reach</div>
            <div className="dir-step">
              <div className="dir-num">1</div>
              <div className="dir-text">Head towards the college playground — it's usually visible from the main pathway.</div>
            </div>
            <div className="dir-step">
              <div className="dir-num">2</div>
              <div className="dir-text">The cafeteria is right beside it. You'll smell the food 😄</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

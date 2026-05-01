export default function Rounds({ now }) {
  const getRoundStatus = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (now >= start && now < end) return { label: 'Live Now', class: 'rs-live' };
    if (now >= end) return { label: 'Done', class: 'rs-done' };
    return { label: 'Upcoming', class: 'rs-upcoming' };
  };

  const r1 = getRoundStatus('2026-05-06T09:00:00', '2026-05-06T14:00:00');
  const r2 = getRoundStatus('2026-05-06T15:00:00', '2026-05-06T21:00:00');
  const r3 = getRoundStatus('2026-05-06T21:00:00', '2026-05-07T07:30:00');

  return (
    <>
      <div style={{ background: 'var(--ink)', borderRadius: '16px', padding: '1.25rem 1.5rem', color: '#fff', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '4px' }}>Format</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '.04em', marginBottom: '4px' }}>3 Rounds · 24 Hours</div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', lineHeight: '1.5' }}>Build → Review → Build → Final Pitch. Mentors evaluate at each stage.</div>
      </div>

      <div className="round-card">
        <div className="round-header">
          <div className="round-num">1</div>
          <div>
            <div className="round-title">Round 1 — Kickoff & Prototype</div>
            <div className="round-time">May 6 · 9:00 AM – 2:00 PM</div>
          </div>
          <div className={`round-status ${r1.class}`}>{r1.label}</div>
        </div>
        <div className="round-body">
          Start building your idea! Focus on getting a working prototype or proof-of-concept.
          <ul>
            <li>Teams finalize idea and divide roles</li>
            <li>Core feature development begins</li>
            <li>Mentors available for guidance</li>
            <li>Review at 2:00 PM — present your progress</li>
          </ul>
        </div>
      </div>

      <div className="round-card">
        <div className="round-header">
          <div className="round-num">2</div>
          <div>
            <div className="round-title">Round 2 — Deep Build Phase</div>
            <div className="round-time">May 6 · 3:00 PM – 9:00 PM</div>
          </div>
          <div className={`round-status ${r2.class}`}>{r2.label}</div>
        </div>
        <div className="round-body">
          Based on Round 1 feedback, push your project further. Add features, fix issues, polish your build.
          <ul>
            <li>Implement mentor feedback from Round 1</li>
            <li>Add secondary features & UI/UX polish</li>
            <li>Prepare demo for Round 2 review at 9:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="round-card">
        <div className="round-header">
          <div className="round-num">3</div>
          <div>
            <div className="round-title">Final Round — Polish & Present</div>
            <div className="round-time">May 6, 9:00 PM – May 7, 7:30 AM</div>
          </div>
          <div className={`round-status ${r3.class}`}>{r3.label}</div>
        </div>
        <div className="round-body">
          Final stretch! Polish your project, prepare your pitch, and submit before the deadline.
          <ul>
            <li>Final coding & testing</li>
            <li>Prepare your 5-minute presentation</li>
            <li>Submit by <strong>7:30 AM on May 7</strong></li>
            <li>Final presentations at 8:00 AM — Amphitheater</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '14px 16px', background: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--sw)', marginBottom: '4px' }}>💡 Judging Criteria</div>
        <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: '1.7' }}>
          Innovation &amp; Creativity · Technical Complexity · Problem-Solution Fit · Working Demo · Presentation Quality
        </div>
      </div>
    </>
  );
}

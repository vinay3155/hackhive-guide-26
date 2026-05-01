export default function Schedule({ now }) {
  const getStatus = (baseDate, startStr, endStr) => {
    const [sh, sm] = startStr.split(':').map(Number);
    const [eh, em] = endStr.split(':').map(Number);
    
    const cardStart = new Date(baseDate);
    cardStart.setHours(sh, sm, 0, 0);
    
    const cardEnd = new Date(baseDate);
    cardEnd.setHours(eh, em, 0, 0);

    if (now >= cardStart && now < cardEnd) return 'is-live';
    if (now >= cardEnd) return 'is-done';
    return '';
  };

  const day1Date = '2026-05-06';
  const day2Date = '2026-05-07';

  return (
    <>
      <div className="schedule-day-header">Day 1 — May 6, 2026</div>

      <div className={`sched-card ${getStatus(day1Date, '08:00', '09:00')}`}>
        <div className="sched-time-col"><span className="sched-time">8:00</span><span className="sched-ampm">AM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Opening Ceremony & Problem Statement Reveal</div>
          <div className="sched-loc-line">📍 Amphitheater Area</div>
          <span className="sched-tag st-event">Opening</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '09:00', '11:00')}`}>
        <div className="sched-time-col"><span className="sched-time">9:00</span><span className="sched-ampm">AM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">🚀 Hacking Begins!</div>
          <div className="sched-loc-line">📍 Rooms 101–105 (Hardware) · KTech Lab (Software)</div>
          <span className="sched-tag st-round">Round 1 Starts</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '11:00', '11:30')}`}>
        <div className="sched-time-col"><span className="sched-time">11:00</span><span className="sched-ampm">AM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Morning Snacks</div>
          <div className="sched-loc-line">📍 Cafeteria, beside Playground</div>
          <span className="sched-tag st-snack">Snack Break</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '13:30', '14:30')}`}>
        <div className="sched-time-col"><span className="sched-time">1:30</span><span className="sched-ampm">PM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Lunch</div>
          <div className="sched-loc-line">📍 Cafeteria, beside Playground</div>
          <span className="sched-tag st-food">Meal</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '14:00', '15:00')}`}>
        <div className="sched-time-col"><span className="sched-time">2:00</span><span className="sched-ampm">PM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Round 1 Review — Mentor Evaluation</div>
          <div className="sched-loc-line">📍 At your respective track room</div>
          <span className="sched-tag st-round">Round 1 Review</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '15:00', '17:00')}`}>
        <div className="sched-time-col"><span className="sched-time">3:00</span><span className="sched-ampm">PM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Round 2 — Deep Build Phase</div>
          <div className="sched-loc-line">📍 Rooms 101–105 (Hardware) · KTech Lab (Software)</div>
          <span className="sched-tag st-round">Round 2 Starts</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '17:00', '17:30')}`}>
        <div className="sched-time-col"><span className="sched-time">5:00</span><span className="sched-ampm">PM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Evening Snacks & Tea / Coffee</div>
          <div className="sched-loc-line">📍 Cafeteria, beside Playground</div>
          <span className="sched-tag st-snack">Snack Break</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '20:00', '21:00')}`}>
        <div className="sched-time-col"><span className="sched-time">8:00</span><span className="sched-ampm">PM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Dinner</div>
          <div className="sched-loc-line">📍 Cafeteria, beside Playground</div>
          <span className="sched-tag st-food">Meal</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '21:00', '23:59')}`}>
        <div className="sched-time-col"><span className="sched-time">9:00</span><span className="sched-ampm">PM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Round 2 Review — Mentor Check-in</div>
          <div className="sched-loc-line">📍 At your respective track room</div>
          <span className="sched-tag st-round">Round 2 Review</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day1Date, '23:00', '23:30')}`}>
        <div className="sched-time-col"><span className="sched-time">11:00</span><span className="sched-ampm">PM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Midnight Snacks & Energy Drinks 🌙</div>
          <div className="sched-loc-line">📍 Cafeteria, beside Playground</div>
          <span className="sched-tag st-snack">Midnight Fuel</span>
        </div>
      </div>

      <div className="schedule-day-header">Day 2 — May 7, 2026</div>

      <div className={`sched-card ${getStatus(day2Date, '06:00', '06:30')}`}>
        <div className="sched-time-col"><span className="sched-time">6:00</span><span className="sched-ampm">AM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Breakfast ☀️</div>
          <div className="sched-loc-line">📍 Cafeteria, beside Playground</div>
          <span className="sched-tag st-food">Meal</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day2Date, '07:30', '08:00')}`}>
        <div className="sched-time-col"><span className="sched-time">7:30</span><span className="sched-ampm">AM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">⚠️ Final Submission Deadline</div>
          <div className="sched-loc-line">📍 Submit at your track room</div>
          <span className="sched-tag st-deadline">Deadline</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day2Date, '08:00', '10:00')}`}>
        <div className="sched-time-col"><span className="sched-time">8:00</span><span className="sched-ampm">AM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">Final Presentations — Judging Panel</div>
          <div className="sched-loc-line">📍 Amphitheater Area</div>
          <span className="sched-tag st-round">Finals</span>
        </div>
      </div>

      <div className={`sched-card ${getStatus(day2Date, '10:30', '12:00')}`}>
        <div className="sched-time-col"><span className="sched-time">10:30</span><span className="sched-ampm">AM</span></div>
        <div className="sched-divider"></div>
        <div className="sched-body">
          <div className="sched-name">🏆 Award Ceremony & Closing</div>
          <div className="sched-loc-line">📍 Amphitheater Area</div>
          <span className="sched-tag st-event">Closing</span>
        </div>
      </div>
    </>
  );
}

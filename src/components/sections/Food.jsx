export default function Food({ now }) {
  const getFoodClass = (timeStr) => {
    // Basic logic to determine if this is the "next" food.
    // The provided HTML did this dynamically but for simplicity here,
    // we can implement a basic check or just skip the "Next" badge logic if it's too complex,
    // but let's implement it.
    
    // Convert timeStr to Date
    const target = new Date(timeStr);
    
    // We want the FIRST food item that is in the future.
    return now < target;
  };

  const foodItems = [
    { name: 'Morning Snacks', timeStr: 'May 6 · 11:00 AM', timeObj: '2026-05-06T11:00:00', loc: '📍 Cafeteria, beside Playground', emoji: '🥐' },
    { name: 'Lunch', timeStr: 'May 6 · 1:30 PM', timeObj: '2026-05-06T13:30:00', loc: '📍 Cafeteria, beside Playground', emoji: '🍱' },
    { name: 'Evening Snacks & Tea', timeStr: 'May 6 · 5:00 PM', timeObj: '2026-05-06T17:00:00', loc: '📍 Cafeteria, beside Playground', emoji: '☕' },
    { name: 'Dinner', timeStr: 'May 6 · 8:00 PM', timeObj: '2026-05-06T20:00:00', loc: '📍 Cafeteria, beside Playground', emoji: '🍛' },
    { name: 'Midnight Snacks & Energy Drinks', timeStr: 'May 6 · 11:00 PM', timeObj: '2026-05-06T23:00:00', loc: '📍 Cafeteria, beside Playground', emoji: '🌙' },
    { name: 'Breakfast', timeStr: 'May 7 · 6:00 AM', timeObj: '2026-05-07T06:00:00', loc: '📍 Cafeteria, beside Playground', emoji: '🍳' }
  ];

  let nextSet = false;

  return (
    <>
      <div className="food-hero">
        <h3>All Meals Included</h3>
        <p>6 meals over 24 hours — all at the Cafeteria beside the Playground. Just show up!</p>
      </div>

      <div className="food-list">
        {foodItems.map((item, idx) => {
          let isNext = false;
          if (now < new Date(item.timeObj) && !nextSet) {
            isNext = true;
            nextSet = true;
          }

          return (
            <div key={idx} className={`food-item ${isNext ? 'next-food' : ''}`}>
              <div className="food-emoji">{item.emoji}</div>
              <div>
                <div className="food-item-name">{item.name}</div>
                <div className="food-item-time">{item.timeStr}</div>
                <div className="food-item-loc">{item.loc}</div>
              </div>
              {isNext && <div className="food-badge">Next</div>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1.25rem', padding: '14px 16px', background: '#FFF7E6', borderRadius: '12px', border: '1px solid #FDE68A' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--warn)', marginBottom: '4px' }}>⚠️ Important</div>
        <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: '1.5' }}>Carry your participant ID at all times — required to collect food from the cafeteria.</div>
      </div>
    </>
  );
}

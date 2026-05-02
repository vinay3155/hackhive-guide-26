import React, { useState } from 'react';

const PROBLEM_STATEMENTS = [
  {
    id: 1,
    title: "Smart Campus Navigation",
    domain: "Web/App Dev",
    description: "Design an interactive web or mobile application that helps new students and visitors navigate the college campus efficiently. It should include routing, building directories, and accessibility options.",
    outcome: "A functional prototype showing map integration and pathfinding."
  },
  {
    id: 2,
    title: "AI-Powered Notes Summarizer",
    domain: "AI / ML",
    description: "Build a tool that can take raw lecture transcripts, PDFs, or handwritten notes (OCR) and use AI to generate concise, structured study summaries and flashcards.",
    outcome: "A web app where users can upload documents and receive formatted summaries."
  },
  {
    id: 3,
    title: "Decentralized Credential Verification",
    domain: "Web3 / Blockchain",
    description: "Create a smart contract system for issuing and verifying digital certificates or hackathon participation badges on the blockchain to prevent resume fraud.",
    outcome: "A working smart contract deployed on a testnet with a simple UI for minting/verifying."
  }
];

export default function Challenges({ track, challengesReleased, selectedChallenge, participantId }) {
  const [openCard, setOpenCard] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (track === 'hardware') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
        <h3 style={{ fontSize: '20px', color: 'var(--ink)', marginBottom: '8px' }}>Hardware Track</h3>
        <p style={{ color: 'var(--ink3)', fontSize: '14px', lineHeight: '1.6' }}>
          These problem statements are specifically for the Software Track. Hardware teams have an open innovation theme! Please proceed to your designated lab area to begin building.
        </p>
      </div>
    );
  }

  if (!challengesReleased) {
    return (
      <div className="locked-container">
        <div className="lock-icon">🔒</div>
        <h3 className="locked-title">Problem Statements Locked</h3>
        <p className="locked-desc">The specific challenges will automatically reveal themselves when the Organizer launches them.</p>
        <div style={{ padding: '12px 20px', background: 'var(--warn-bg)', color: 'var(--warn)', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
          ⏳ Waiting for Organizer...
        </div>
      </div>
    );
  }

  const handleSelect = async (challengeId) => {
    if (!window.confirm("Are you sure you want to select this problem statement? Your choice will be permanently locked in.")) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/select-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: participantId, challengeId })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      // Let the 3-second polling update the UI automatically.
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="challenges-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: 'var(--ink)', letterSpacing: '0.05em' }}>
          Software Track <span style={{ color: '#096DD9' }}>Challenges</span>
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink3)' }}>Select a problem statement below to view the full requirements and expected outcomes.</p>
        {selectedChallenge && (
           <div style={{ marginTop: '12px', background: '#F0FFF4', border: '1px solid #BBF7D0', padding: '10px 16px', borderRadius: '8px', color: '#15803D', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
             ✅ You have permanently locked in your Problem Statement choice.
           </div>
        )}
      </div>

      <div className="accordion">
        {PROBLEM_STATEMENTS.map((ps) => {
          const isOpen = openCard === ps.id;
          const isSelected = selectedChallenge === ps.id;
          const isDisabled = selectedChallenge !== null && !isSelected;

          return (
            <div key={ps.id} className={`acc-card ${isOpen ? 'open' : ''}`} style={{ opacity: isDisabled ? 0.5 : 1 }}>
              <button className="acc-header" onClick={() => setOpenCard(isOpen ? null : ps.id)}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="acc-tag">{ps.domain}</span>
                    {isSelected && <span style={{ fontSize: '10px', background: '#15803D', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>SELECTED</span>}
                  </div>
                  <span className="acc-title">{ps.title}</span>
                </div>
                <div className={`acc-icon ${isOpen ? 'rotated' : ''}`}>▼</div>
              </button>
              
              <div className="acc-body" style={{ maxHeight: isOpen ? '800px' : '0' }}>
                <div className="acc-content">
                  <div style={{ marginBottom: '12px' }}>
                    <strong>The Challenge:</strong>
                    <p style={{ marginTop: '4px' }}>{ps.description}</p>
                  </div>
                  <div style={{ background: '#F0FFF4', border: '1px solid #BBF7D0', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong style={{ color: '#15803D' }}>🎯 Expected Outcome:</strong>
                    <p style={{ color: '#166534', marginTop: '4px' }}>{ps.outcome}</p>
                  </div>

                  {!selectedChallenge && (
                    <button 
                      onClick={() => handleSelect(ps.id)}
                      disabled={isSubmitting}
                      style={{ width: '100%', background: '#096DD9', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                    >
                      {isSubmitting ? 'Locking in...' : '🎯 Select This Challenge'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function Feedback({ teamName }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return alert('Please select a star rating first!');
    
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, rating, feedbackText })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-success">
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
        Thank you for your feedback!
        <div style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--ink3)', marginTop: '8px' }}>
          We hope you had an amazing time at HackHive Guide 26.
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-card">
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '8px' }}>
        Rate HackHive Guide 26
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--ink3)', marginBottom: '20px' }}>
        How was your experience at the hackathon? Let us know!
      </p>

      {/* Star Rating */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="star-btn"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            style={{ 
              fontSize: '36px', 
              color: (hoverRating || rating) >= star ? '#F59E0B' : '#E2DDD6' 
            }}
          >
            ★
          </button>
        ))}
      </div>

      <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)', marginBottom: '8px', minHeight: '20px' }}>
        {rating === 1 && 'Needs Improvement 😕'}
        {rating === 2 && 'It was Okay 🙂'}
        {rating === 3 && 'Good Experience 🚀'}
        {rating === 4 && 'Great Hackathon! 🔥'}
        {rating === 5 && 'Absolutely Amazing! 🤯'}
      </div>

      <textarea 
        className="feedback-textarea"
        placeholder="Tell us what you liked or how we can improve next year..."
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      />

      <button 
        className="feedback-submit" 
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{ opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}

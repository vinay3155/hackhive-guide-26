import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Coffee, Target, ArrowLeft } from 'lucide-react';

import WhereToGo from '../components/sections/WhereToGo';
import Schedule from '../components/sections/Schedule';
import Food from '../components/sections/Food';
import Rounds from '../components/sections/Rounds';

export default function TrackView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('where');

  const isSoftware = id === 'software';
  const trackName = isSoftware ? 'Software Track' : 'Hardware Track';

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Tracks
      </Link>
      
      <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>
        <span className={isSoftware ? "text-gradient" : "text-gradient-pink"}>{trackName}</span> Portal
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Everything you need to navigate and succeed in the {trackName.toLowerCase()}.
      </p>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'where' ? 'active' : ''}`}
          onClick={() => setActiveTab('where')}
        >
          <MapPin size={16} /> Where to Go
        </button>
        <button 
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={16} /> Schedule
        </button>
        <button 
          className={`tab-button ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          <Coffee size={16} /> Food
        </button>
        <button 
          className={`tab-button ${activeTab === 'rounds' ? 'active' : ''}`}
          onClick={() => setActiveTab('rounds')}
        >
          <Target size={16} /> Rounds
        </button>
      </div>

      {/* Tab Content Rendering */}
      <div className="tab-content animate-fade-in">
        {activeTab === 'where' && <WhereToGo isSoftware={isSoftware} />}
        {activeTab === 'schedule' && <Schedule isSoftware={isSoftware} />}
        {activeTab === 'food' && <Food />}
        {activeTab === 'rounds' && <Rounds />}
      </div>
    </div>
  );
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database
const participants = {}; 
// id -> { id, teamName, phone, track: 'hardware' | 'software', checkedIn: boolean, exitStatus: 'none' | 'pending' | 'granted' | 'rejected', sosRequest: null | { type: 'mentor' | 'emergency', timestamp: number } }

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// 1. Register a new participant/team
app.post('/api/register', (req, res) => {
  const { teamName, phone, track } = req.body;
  if (!teamName || !phone || !track) {
    return res.status(400).json({ error: 'Team name, phone, and track are required.' });
  }

  const id = generateId();
  participants[id] = {
    id,
    teamName,
    phone,
    track,
    checkedIn: false,
    exitStatus: 'none',
    exitReason: '',
    sosRequest: null
  };

  res.json({ id, message: 'Registration successful' });
});

// 2. Check-in
app.post('/api/check-in', (req, res) => {
  const { id } = req.body;
  if (!participants[id]) return res.status(404).json({ error: 'Participant not found.' });

  participants[id].checkedIn = true;
  res.json({ message: 'Successfully checked in!' });
});

// 3. Request Exit
app.post('/api/exit-request', (req, res) => {
  const { id, reason } = req.body;
  if (!participants[id]) return res.status(404).json({ error: 'Participant not found.' });

  if (!participants[id].checkedIn) {
    return res.status(400).json({ error: 'You must check in first.' });
  }

  participants[id].exitStatus = 'pending';
  participants[id].exitReason = reason || '';
  res.json({ message: 'Exit request sent. Waiting for approval.' });
});

// 4. SOS Request
app.post('/api/sos-request', (req, res) => {
  const { id, type } = req.body;
  if (!participants[id]) return res.status(404).json({ error: 'Participant not found.' });

  participants[id].sosRequest = {
    type,
    timestamp: Date.now()
  };
  
  res.json({ message: 'SOS alert sent to organizers!' });
});

// 5. Get Participant Status (Polling)
app.get('/api/status/:id', (req, res) => {
  const { id } = req.params;
  const p = participants[id];
  if (!p) return res.status(404).json({ error: 'Participant not found.' });

  res.json({
    checkedIn: p.checkedIn,
    exitStatus: p.exitStatus,
    track: p.track,
    hasActiveSos: p.sosRequest !== null
  });
});

// ==========================================
// ORGANIZER ROUTES
// ==========================================

// Get all stats
app.get('/api/organizer/stats', (req, res) => {
  const allParticipants = Object.values(participants);
  
  const hwCheckedIn = allParticipants.filter(p => p.checkedIn && p.track === 'hardware').length;
  const swCheckedIn = allParticipants.filter(p => p.checkedIn && p.track === 'software').length;
  
  // Pending Exit requests
  const pendingExits = allParticipants.filter(p => p.exitStatus === 'pending');
  // Processed requests
  const processedExits = allParticipants.filter(p => p.exitStatus === 'granted' || p.exitStatus === 'rejected');

  // Active SOS Alerts
  const sosAlerts = allParticipants.filter(p => p.sosRequest !== null);

  res.json({
    hwCheckedIn,
    swCheckedIn,
    pendingExits,
    processedExits,
    sosAlerts
  });
});

// Respond to an exit request
app.post('/api/organizer/respond', (req, res) => {
  const { id, status } = req.body; 
  if (!participants[id]) return res.status(404).json({ error: 'Participant not found.' });

  participants[id].exitStatus = status;
  res.json({ message: `Request marked as ${status}` });
});

// Resolve SOS Alert
app.post('/api/organizer/resolve-sos', (req, res) => {
  const { id } = req.body;
  if (!participants[id]) return res.status(404).json({ error: 'Participant not found.' });

  participants[id].sosRequest = null;
  res.json({ message: 'SOS Alert resolved.' });
});

// ==========================================
// SERVE REACT FRONTEND IN PRODUCTION
// ==========================================
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React client-side routing — serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

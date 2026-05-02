import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (like MONGODB_URI)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// MONGODB DATABASE SETUP
// ==========================================
const participantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  teamName: String,
  phone: String,
  track: String,
  checkedIn: { type: Boolean, default: false },
  exitStatus: { type: String, default: 'none' },
  exitReason: { type: String, default: '' },
  sosRequest: {
    type: { type: String }, // 'mentor' or 'emergency'
    timestamp: Number
  }
});
const Participant = mongoose.model('Participant', participantSchema);

const feedbackSchema = new mongoose.Schema({
  teamName: String,
  rating: Number, // 1 to 5
  feedbackText: String,
  timestamp: { type: Number, default: () => Date.now() }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Generate a random ID (same as before to keep frontend compatible)
const generateId = () => Math.random().toString(36).substring(2, 10);

// ==========================================
// PARTICIPANT ROUTES
// ==========================================

// 1. Register a new participant/team
app.post('/api/register', async (req, res) => {
  try {
    const { teamName, phone, track } = req.body;
    if (!teamName || !phone || !track) {
      return res.status(400).json({ error: 'Team name, phone, and track are required.' });
    }

    const id = generateId();
    await Participant.create({
      id,
      teamName,
      phone,
      track,
      checkedIn: false,
      exitStatus: 'none',
      exitReason: '',
      sosRequest: null
    });

    res.json({ id, message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. Check-in
app.post('/api/check-in', async (req, res) => {
  try {
    const { id } = req.body;
    const p = await Participant.findOneAndUpdate({ id }, { checkedIn: true });
    if (!p) return res.status(404).json({ error: 'Participant not found.' });

    res.json({ message: 'Successfully checked in!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Request Exit
app.post('/api/exit-request', async (req, res) => {
  try {
    const { id, reason } = req.body;
    const p = await Participant.findOne({ id });
    if (!p) return res.status(404).json({ error: 'Participant not found.' });
    if (!p.checkedIn) return res.status(400).json({ error: 'You must check in first.' });

    p.exitStatus = 'pending';
    p.exitReason = reason || '';
    await p.save();
    
    res.json({ message: 'Exit request sent. Waiting for approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. SOS Request
app.post('/api/sos-request', async (req, res) => {
  try {
    const { id, type } = req.body;
    const p = await Participant.findOneAndUpdate({ id }, { 
      sosRequest: { type, timestamp: Date.now() } 
    });
    if (!p) return res.status(404).json({ error: 'Participant not found.' });
    
    res.json({ message: 'SOS alert sent to organizers!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. Get Participant Status (Polling)
app.get('/api/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Participant.findOne({ id });
    if (!p) return res.status(404).json({ error: 'Participant not found.' });

    res.json({
      checkedIn: p.checkedIn,
      exitStatus: p.exitStatus,
      track: p.track,
      hasActiveSos: p.sosRequest !== null
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 6. Submit Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { teamName, rating, feedbackText } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required' });

    await Feedback.create({
      teamName: teamName || 'Anonymous',
      rating,
      feedbackText: feedbackText || ''
    });

    res.json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// ORGANIZER ROUTES
// ==========================================

// Get all stats
app.get('/api/organizer/stats', async (req, res) => {
  try {
    const allParticipants = await Participant.find({});
    const feedbacks = await Feedback.find({}).sort({ timestamp: -1 });
    
    const hwCheckedIn = allParticipants.filter(p => p.checkedIn && p.track === 'hardware').length;
    const swCheckedIn = allParticipants.filter(p => p.checkedIn && p.track === 'software').length;
    
    // Pending Exit requests
    const pendingExits = allParticipants.filter(p => p.exitStatus === 'pending');
    // Processed requests
    const processedExits = allParticipants.filter(p => p.exitStatus === 'granted' || p.exitStatus === 'rejected');

    // Active SOS Alerts
    const sosAlerts = allParticipants.filter(p => p.sosRequest !== null && p.sosRequest.type); // ensure type exists

    const allTeams = allParticipants.map(p => ({
      id: p.id,
      teamName: p.teamName,
      phone: p.phone,
      track: p.track,
      checkedIn: p.checkedIn
    }));

    res.json({
      hwCheckedIn,
      swCheckedIn,
      pendingExits,
      processedExits,
      sosAlerts,
      allTeams,
      feedbacks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Respond to an exit request
app.post('/api/organizer/respond', async (req, res) => {
  try {
    const { id, status } = req.body; 
    const p = await Participant.findOneAndUpdate({ id }, { exitStatus: status });
    if (!p) return res.status(404).json({ error: 'Participant not found.' });

    res.json({ message: `Request marked as ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Resolve SOS Alert
app.post('/api/organizer/resolve-sos', async (req, res) => {
  try {
    const { id } = req.body;
    // Set sosRequest to empty object to remove it, or use $unset
    await Participant.findOneAndUpdate({ id }, { $unset: { sosRequest: "" } });
    
    res.json({ message: 'SOS Alert resolved.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
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

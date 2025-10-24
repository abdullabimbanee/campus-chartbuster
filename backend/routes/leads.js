const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Lead = require('../models/Lead');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// auth middleware
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// get leaderboard (top leads)
router.get('/leaderboard', async (req, res) => {
  try {
    const top = await Lead.find().sort({ points: -1 }).limit(50).populate('user', 'name college');
    res.json(top);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// get current user's lead profile
router.get('/me', auth, async (req, res) => {
  try {
    const lead = await Lead.findOne({ user: req.user.id }).populate('user', 'name college email');
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// admin-only: update points (for demo simplicity we allow role check)
router.post('/update/:leadId', auth, async (req, res) => {
  try {
    // only admin can update points in this basic app
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });

    const { points, eventsHosted, participants } = req.body;
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });

    if (typeof points === 'number') lead.points = points;
    if (typeof eventsHosted === 'number') lead.eventsHosted = eventsHosted;
    if (typeof participants === 'number') lead.participants = participants;

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

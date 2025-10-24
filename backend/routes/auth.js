const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lead = require('../models/Lead');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// register
router.post('/register', async (req, res) => {
    try {
        const { name, college, email, password } = req.body;
        if (!name || !college || !email || !password) return res.status(400).json({ msg: 'Please fill all fields' });

        let existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'Email already registered' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({ name, college, email, passwordHash });
        await user.save();

        // create lead stats doc
        const lead = new Lead({ user: user._id });
        await lead.save();

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, college: user.college, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'Please provide email and password' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, college: user.college, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

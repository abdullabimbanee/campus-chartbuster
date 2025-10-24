const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, default: 0 },
    eventsHosted: { type: Number, default: 0 },
    participants: { type: Number, default: 0 },
    badges: { type: [String], default: [] }
});

module.exports = mongoose.model('Lead', LeadSchema);

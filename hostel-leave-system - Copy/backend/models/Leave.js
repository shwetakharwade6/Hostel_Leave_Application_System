const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  reason: { type: String, required: true },
  roomNo: { type: String },
  status: { type: String, default: 'Pending ⏳' },
  parentNo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
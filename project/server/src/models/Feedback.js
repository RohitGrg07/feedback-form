const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true, trim: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);



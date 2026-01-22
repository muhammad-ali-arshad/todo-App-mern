const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Log before save to verify completed value
taskSchema.pre('save', function(next) {
  if (this.isNew) {
    console.log('[MODEL] Pre-save - completed:', this.completed, 'type:', typeof this.completed);
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
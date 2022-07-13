const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must provide name'],
    trim: true,
    maxlength: [30, 'Name cannot be more than 30 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  likes: {
     type: Number,
    default: 0,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);

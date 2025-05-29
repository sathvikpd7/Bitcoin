import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  departmentYear: { type: String, required: true },
  experience: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  languages: { type: String, required: true },
  motivation: { type: String, required: true },
  skillsToGain: { type: String, required: true },
  hoursPerWeek: { type: String, required: true },
  preferredTime: { type: String, required: true, enum: ['Weekdays', 'Weekends'] },
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
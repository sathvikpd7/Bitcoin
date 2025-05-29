import express from 'express';
import Registration from '../models/Registration.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);

    // Format languages array to string if needed
    if (Array.isArray(req.body.languages)) {
      req.body.languages = req.body.languages.join(', ');
    }

    console.log('Creating registration with data:', req.body);
    const registration = new Registration(req.body);
    
    console.log('Saving registration...');
    await registration.save();
    
    console.log('Registration saved successfully');
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      errors: err.errors
    });

    if (err.code === 11000) {
      res.status(400).json({ message: 'Email already registered' });
    } else if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: `Error saving data: ${err.message}` });
    }
  }
});

export default router;
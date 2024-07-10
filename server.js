const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// More detailed CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comedyApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Joke schema
const jokeSchema = new mongoose.Schema({
  content: String,
  type: String,
  keywords: [String],
  timestamp: { type: Date, default: Date.now }
});

const Joke = mongoose.model('Joke', jokeSchema);

// API Routes
app.get('/api/jokes', async (req, res) => {
  try {
    const jokes = await Joke.find();
    res.json(jokes);
  } catch (error) {
    console.error('Error fetching jokes:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/jokes', async (req, res) => {
  try {
    const joke = new Joke(req.body);
    await joke.save();
    res.status(201).json(joke);
  } catch (error) {
    console.error('Error creating joke:', error);
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/jokes/:id', async (req, res) => {
  try {
    const joke = await Joke.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(joke);
  } catch (error) {
    console.error('Error updating joke:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/jokes/:id', async (req, res) => {
  try {
    await Joke.findByIdAndDelete(req.params.id);
    res.json({ message: 'Joke deleted' });
  } catch (error) {
    console.error('Error deleting joke:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
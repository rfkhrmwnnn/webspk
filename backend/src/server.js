const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const criteriaRoutes = require('./routes/criteriaRoutes');
const alternativesRoutes = require('./routes/alternativesRoutes');
const topsisRoutes = require('./routes/topsisRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/criteria', criteriaRoutes);
app.use('/api/alternatives', alternativesRoutes);
app.use('/api/topsis', topsisRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SPK TOPSIS API is running' });
});

// Export for Vercel
module.exports = app;

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Frontend statique
app.use(express.static(path.join(__dirname, '../frontend')));

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API destinations
app.get('/api/destinations', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      lat: 48.8566,
      lng: 2.3522
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japon',
      lat: 35.6895,
      lng: 139.6917
    },
    {
      id: 3,
      name: 'New York',
      country: 'USA',
      lat: 40.7128,
      lng: -74.0060
    }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TravelNow running on port ${PORT}`);
});

module.exports = app;

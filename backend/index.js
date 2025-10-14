require('dotenv').config({ path: '../.env' });

const express = require('express');
const buildingRouter = require('./routes/buildings');
const cors = require('cors');

const app = express();

const whiteList = [
  'http://localhost:3000'
]

// Enable CORS for all routes
app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true);
    else if(whiteList.includes(origin)) {
      return callback(null, true);
    }
    else {
      callback(new Error('Not allowed cors'));
    }
  }
}));

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/buildings", buildingRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
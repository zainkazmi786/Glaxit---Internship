const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/StudentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(); // connect to MongoDB

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/students', studentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

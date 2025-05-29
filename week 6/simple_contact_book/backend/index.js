const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const contactRoutes = require('./routes/contactRoutes');

const PORT = process.env.PORT || 5000;


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRoutes);

app.get('/', (req, res) => {
  res.send('Contact Book API is running');
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));

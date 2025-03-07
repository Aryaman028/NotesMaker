const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mern', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.use('/api/notes', notesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

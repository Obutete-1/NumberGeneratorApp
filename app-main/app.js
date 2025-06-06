require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use environment variable for MongoDB connection string
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { codes: [], username: '' });
});

app.post('/generate', async (req, res) => {
  const length = parseInt(req.body.length);
  const combinations = parseInt(req.body.combinations);
  const username = req.body.username;

  const codes = [];
  for (let i = 0; i < combinations; i++) {
    // Generate numeric codes
    let code = '';
    for (let j = 0; j < length; j++) {
      code += Math.floor(Math.random() * 10); // Generate a digit (0-9)
    }
    codes.push(code);
  }

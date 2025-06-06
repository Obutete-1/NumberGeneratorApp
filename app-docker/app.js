const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('views'));

mongoose.connect('mongodb://mongo:27017/nomcomboDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Schema and Model
const ComboSchema = new mongoose.Schema({
    username: String,
    length: Number,
    count: Number,
    combinations: [String]
});

const Combo = mongoose.model('Combo', ComboSchema);

// Generate random combinations
function generateRandomCombos(length, count) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const combos = [];

    for (let i = 0; i < count; i++) {
        let str = '';
        for (let j = 0; j < length; j++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        combos.push(str);
    }

    return combos;
}

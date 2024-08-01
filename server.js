const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Fake database (JSON file for simplicity)
const dbFile = 'clickCounts.json';

// Initialize the fake database
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({}));
}

// Get click counts
app.get('/clicks', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbFile));
    res.json(data);
});

// Update click count
app.post('/click', (req, res) => {
    const { productId } = req.body;
    const data = JSON.parse(fs.readFileSync(dbFile));
    
    if (!data[productId]) {
        data[productId] = 0;
    }

    data[productId]++;
    fs.writeFileSync(dbFile, JSON.stringify(data));
    res.json({ success: true, clickCount: data[productId] });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

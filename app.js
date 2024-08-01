const express = require('express');
const router = express.Router();
const connectToDatabase = require('./db');

router.post('/update-click-count', async (req, res) => {
    const { cardId } = req.body;

    if (!cardId) {
        return res.status(400).json({ error: 'Card ID is required' });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('clicks');
        
        const result = await collection.findOneAndUpdate(
            { cardId: cardId },
            { $inc: { count: 1 } },
            { returnDocument: 'after', upsert: true }
        );

        res.status(200).json({ clickCount: result.value.count });
    } catch (error) {
        console.error('Error updating click count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-click-count/:cardId', async (req, res) => {
    const { cardId } = req.params;

    if (!cardId) {
        return res.status(400).json({ error: 'Card ID is required' });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('clicks');
        
        const result = await collection.findOne({ cardId: cardId });
        
        res.status(200).json({ clickCount: result ? result.count : 0 });
    } catch (error) {
        console.error('Error retrieving click count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

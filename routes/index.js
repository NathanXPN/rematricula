const express = require('express');
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Outras rotas...

module.exports = router;

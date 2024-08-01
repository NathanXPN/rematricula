const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rematricula', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ClickSchema = new mongoose.Schema({
  productId: String,
  clicks: Number,
  limit: Number
});

const Click = mongoose.model('Click', ClickSchema);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rota para obter contagem de cliques
app.get('/api/clicks/:productId', async (req, res) => {
  const { productId } = req.params;
  const clickData = await Click.findOne({ productId });
  res.json(clickData);
});

// Rota para atualizar contagem de cliques
app.post('/api/clicks', async (req, res) => {
  const { productId } = req.body;
  const clickData = await Click.findOne({ productId });
  if (clickData) {
    if (clickData.clicks < clickData.limit) {
      clickData.clicks += 1;
      await clickData.save();
      res.json(clickData);
    } else {
      res.status(400).json({ message: 'Limite de cliques atingido.' });
    }
  } else {
    const newClickData = new Click({ productId, clicks: 1, limit: 5 });
    await newClickData.save();
    res.json(newClickData);
  }
});

// Para o Heroku servir os arquivos estáticos
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

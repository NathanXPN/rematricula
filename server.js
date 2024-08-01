const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Caminho para o arquivo JSON
const dbFile = path.join(__dirname, 'clickCounts.json');

// Inicializa o banco de dados se não existir
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({}));
}

// Rota para obter contagens de cliques
app.get('/clicks', (req, res) => {
    fs.readFile(dbFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading click counts');
        }
        try {
            const jsonData = JSON.parse(data);
            res.setHeader('Content-Type', 'application/json');
            res.json(jsonData);
        } catch (error) {
            res.status(500).send('Error parsing JSON data');
        }
    });
});

// Rota para atualizar a contagem de cliques
app.post('/click', (req, res) => {
    fs.readFile(dbFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading click counts');
        }
        try {
            const jsonData = JSON.parse(data);
            const { productId } = req.body;
            if (!jsonData[productId]) {
                jsonData[productId] = 0;
            }
            jsonData[productId]++;
            fs.writeFile(dbFile, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error writing click counts');
                }
                res.json({ success: true, clickCount: jsonData[productId] });
            });
        } catch (error) {
            res.status(500).send('Error parsing JSON data');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

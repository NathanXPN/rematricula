const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://nathanbuenno:<password>@rematricula.hxfjcvb.mongodb.net/?retryWrites=true&w=majority&appName=rematricula'; // Substitua pelo URL de conexão do MongoDB Atlas se estiver usando
const dbName = 'rematricula'; // Substitua pelo nome do seu banco de dados

let db = null;

async function connectToDatabase() {
    if (db) return db;

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
}

module.exports = connectToDatabase;

const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'hunjry',
  password: 'A05i24y2004m.',
  port: 5432,
});

client.connect();

// API endpoint to fetch recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
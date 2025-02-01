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
app.use(express.static('public')); // Serve static files from the "public" directory
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

// API endpoint to fetch comments for a recipe
app.get('/api/comments/:recipeId', async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const result = await client.query('SELECT * FROM comments WHERE recipe_id = $1', [recipeId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// API endpoint to fetch likes for a recipe
app.get('/api/likes/:recipeId', async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const result = await client.query('SELECT * FROM likes WHERE recipe_id = $1', [recipeId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching likes:', err);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

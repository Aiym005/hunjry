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

app.use(express.static('public'));

app.get('/api/recipes', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

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

app.post('/api/comments', async (req, res) => {
  const { recipe_id, user_name, comment_text } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO comments (recipe_id, user_name, comment_text) VALUES ($1, $2, $3) RETURNING *',
      [recipe_id, user_name, comment_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.get('/api/likes/:recipeId', async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const result = await client.query('SELECT COUNT(*) FROM likes WHERE recipe_id = $1', [recipeId]);
    res.json({ likes: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Error fetching likes:', err);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'htmls', 'nuur.html'));
});

app.get('/htmls/:file', (req, res) => {
  const file = req.params.file;
  res.sendFile(path.join(__dirname, 'public', 'htmls', file));
});

app.post('/api/likes', async (req, res) => {
  const { recipe_id, user_id } = req.body;
  try {
    await client.query(
      'INSERT INTO likes (recipe_id, user_id) VALUES ($1, $2) ON CONFLICT (recipe_id, user_id) DO NOTHING',
      [recipe_id, user_id]
    );
    res.status(201).json({ message: 'Like added' });
  } catch (err) {
    console.error('Error adding like:', err);
    res.status(500).json({ error: 'Failed to add like' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

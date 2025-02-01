const { Client } = require('pg');
const fs = require('fs');

// Database connection configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'hunjry',
  password: 'A05i24y2004m.',
  port: 5432,
});

// Connect to the database
client.connect();

// Function to create tables
async function createTables() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        ingredients TEXT[],
        instructions TEXT[],
        prepTimeMinutes INT,
        cookTimeMinutes INT,
        servings INT,
        difficulty TEXT,
        cuisine TEXT,
        caloriesPerServing INT,
        tags TEXT[],
        userId INT,
        image TEXT,
        rating FLOAT,
        reviewCount INT,
        mealType TEXT[],
        comments JSONB
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        userId SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        likedFoods INT[],
        address TEXT,
        phoneNumber BIGINT,
        email TEXT,
        plannedFoods INT[]
      );
    `);

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

// Function to insert recipes
async function insertRecipes() {
  const recipes = JSON.parse(fs.readFileSync('./json/recipes.json', 'utf8')).recipes;

  for (const recipe of recipes) {
    try {
      await client.query(`
        INSERT INTO recipes (
          id, name, ingredients, instructions, prepTimeMinutes, cookTimeMinutes, servings, difficulty, cuisine, caloriesPerServing, tags, userId, image, rating, reviewCount, mealType, comments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO NOTHING;
      `, [
        recipe.id, recipe.name, recipe.ingredients, recipe.instructions, recipe.prepTimeMinutes, recipe.cookTimeMinutes, recipe.servings, recipe.difficulty, recipe.cuisine, recipe.caloriesPerServing, recipe.tags, recipe.userId, recipe.image, recipe.rating, recipe.reviewCount, recipe.mealType, JSON.stringify(recipe.comments)
      ]);
    } catch (err) {
      console.error('Error inserting recipe:', err);
    }
  }

  console.log('Recipes inserted successfully');
}

// Function to insert users
async function insertUsers() {
  const users = JSON.parse(fs.readFileSync('./json/user.json', 'utf8')).users;

  for (const user of users) {
    try {
      await client.query(`
        INSERT INTO users (
          userId, username, password, likedFoods, address, phoneNumber, email, plannedFoods
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (userId) DO NOTHING;
      `, [
        user.userId, user.username, user.password, user.likedFoods, user.address, user.phoneNumber, user.email, user.plannedFoods || []
      ]);
    } catch (err) {
      console.error('Error inserting user:', err);
    }
  }

  console.log('Users inserted successfully');
}

// Main function to set up the database
async function setupDatabase() {
  await createTables();
  await insertRecipes();
  await insertUsers();
  await client.end();
}

setupDatabase();
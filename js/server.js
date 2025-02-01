const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

app.use(express.json());
app.use(cors());

const usersFile = "./user.json";

app.get("/api/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  res.json(users);
});

app.post("/api/like-food", (req, res) => {
  const { userId, recipeId } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  const user = users.users.find((u) => u.userId === userId);
  if (!user) return res.json({ success: false, message: "User not found" });

  if (!user.likedFoods.includes(recipeId)) {
    user.likedFoods.push(recipeId);
  } else {
    user.likedFoods = user.likedFoods.filter((id) => id !== recipeId);
  }

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));

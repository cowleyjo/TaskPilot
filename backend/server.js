const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { hash } = require("crypto");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

const saltRounds = 10; // industry standard

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

app.use(express.json());

// Static frontend
app.use(express.static(path.join(__dirname, "../frontend"), {
  dotfiles: "deny"
}));

// LEAVE THIS AT THE BOTTOM
app.listen(PORT, () => {
    console.log("Server running on port 3000");
});

app.post("/api/register", async (req, res) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const TABLE = "users";

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;

  const headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  const password = req.body.password;

  req.body.password = await hashPassword(password);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const url = `${SUPABASE_URL}/rest/v1/users?email=eq.${req.body.email}&name=eq.${req.body.name}`;

  const headers = {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = data[0];
    const passedPassword = req.body.password;

    const isValid = await bcrypt.compare(passedPassword, user.password);

    if (isValid) {
      console.log("Password is correct!");
      // TODO: Issue JWT here
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
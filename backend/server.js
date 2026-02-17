const express = require("express");
const path = require("path");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Static frontend
app.use(express.static(path.join(__dirname, "../frontend"), {
  dotfiles: "deny"
}));

app.listen(PORT, () => {
    console.log("Server running on port 3000");
});

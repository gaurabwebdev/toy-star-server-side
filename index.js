const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome To Khelaghor Server");
});

app.listen(port, () => {
  console.log(`Khelaghor is running on ${port}`);
});

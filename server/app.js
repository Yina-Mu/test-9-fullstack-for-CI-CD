require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
app.use(cors());
app.use(express.json());

// test router
app.get("/testRoute", (req, res) => {
  res.send("Hello World!");
});

// Q2 + Q3: auth register / login
app.use("/api/auth", authRoutes);

// Q4: protected user point
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

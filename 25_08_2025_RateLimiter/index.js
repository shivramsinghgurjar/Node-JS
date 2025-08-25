const express = require("express");
const app = express();

app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

// Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

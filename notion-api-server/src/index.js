const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const notionRoutes = require("./routes/notion").default;

app.use(cors());
app.use(express.json());
app.use("/api/notion", notionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express, { json } from "express";
const app = express();
import cors from "cors";
require("dotenv").config();

import notionRoutes from "./routes/notion";

app.use(cors());
app.use(json());
app.use("/api/notion", notionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
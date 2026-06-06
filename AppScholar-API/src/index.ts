import "dotenv/config";
import express from "express";
import cors from "cors"
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server App Scholar running on port ${PORT}`)
})
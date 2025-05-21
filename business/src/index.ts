import express from "express";
import dotenv from "dotenv";
import initRouter from "./routes";
import bodyParser from "body-parser";

// config
dotenv.config();

// app
const app = express();
app.use(bodyParser.json());
initRouter(app);

const PORT = process.env.PORT || 3000;
const runApp = () => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

export const rootDir = __dirname;

export default runApp;
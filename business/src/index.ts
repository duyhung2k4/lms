import express from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import initRouter from "./routes";
import bodyParser from "body-parser";

// config
dotenv.config();

// app
const app = express();
// body
app.use(bodyParser.json());
// cors
var corsOptions: CorsOptions = {
  origin: '*'
}
app.use(cors(corsOptions));
// init app
initRouter(app);

const PORT = process.env.PORT || 3000;
const runApp = () => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

export const rootDir = __dirname;

export default runApp;
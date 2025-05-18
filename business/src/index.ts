import express from "express";

const app = express();

const PORT = 8080;

const runApp = () => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

export default runApp;
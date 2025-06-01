import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import initRouter from "./routes";
import bodyParser from "body-parser";
import client from "prom-client";
import { typesenseClient } from "./infrastructure/connect_typesense";



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



// monitor
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Thời gian phản hồi HTTP tính bằng giây',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5] // buckets thời gian
});
// Middleware để đo thời gian
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const responseTime = (Date.now() - start) / 1000;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, `${res.statusCode}`)
      .observe(responseTime);
  });
  next();
});
// Expose metrics ở /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});



// ping
app.get("/api/ping", (req: Request, res: Response) => {
  res.status(200).json({
    mess: "done",
  });
});



// search
app.get("/api/search", async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if(!q) throw "q not found!";
        console.log(q);
        const results = await typesenseClient.typesenseSearchClient
            .collections("subjects")
            .documents()
            .search({
                q: q.toString(),
                query_by: "*"
            });
        res.status(200).json({
            results,
        })
    } catch (error) {
        res.status(502).json({
            err: `${error}`,
        });
    }
})



// init app
initRouter(app);

const PORT = Number(process.env.PORT || 3000);
const runApp = () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Service sync-typesence: http://localhost:${PORT}`);
  });
}

export const rootDir = __dirname;

export default runApp;
import express, { Express } from "express";
import cors from "cors";
import dashboardRouter from "./routes/dashboard/dashboardRouter";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/dashboard", dashboardRouter);

export default app;

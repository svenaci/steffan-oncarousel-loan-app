import cors from "cors";
import express from "express";
import applicationsRouter from "./routes/applications";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/applications", applicationsRouter);
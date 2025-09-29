import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { Inngest ,functions } from "./inngest/index.js";
import { serve } from "inngest/express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

const inngest = new Inngest({ id: "my-app" });
const functions = [];

app.get("/", (req, res) => res.send("server is Live"));


app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(port, () =>
  console.log(`server listening at http://localhost:${port}`)
);

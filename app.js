import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {URL} from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import rolRoutes from "./routes/rol.js";
//import taskRoutes from "./routes/tasks.routes.js";
import cors from "cors";

const app = express();
var corsOptions = {
  origin: URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
////app.options("*", cors());

app.use("/api", authRoutes);
app.use("/api", rolRoutes);
//app.use("/api", taskRoutes);

export default app;
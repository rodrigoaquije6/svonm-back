import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {URL} from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import rolRoutes from "./routes/rol.js";
import trabajadorRoutes from "./routes/trabajador.js";
import marcaRoutes from "./routes/crear-marca.js";
import monturaRoutes from "./routes/montura.js";
import lunaRoutes from "./routes/luna.js"
import diagnosticoRoutes from "./routes/v-diagnostico.js";
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
app.use("/api", trabajadorRoutes);
app.use("/api", marcaRoutes);
app.use("/api", monturaRoutes);
app.use("/api", lunaRoutes);
app.use("/api", diagnosticoRoutes);

//app.use("/api", taskRoutes);

export default app;
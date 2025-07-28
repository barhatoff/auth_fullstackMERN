import express from "express";
import https from "https";
import cors from "cors";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { constant } from "./constants";
import mongoose from "mongoose";
import { helpers } from "./helpers/helpers";
import { authRouter, errorHandlerRouter, rootRouter } from "./routes";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/root", rootRouter);
app.use(/(.*)/, errorHandlerRouter._notFoundHandler);
app.use(errorHandlerRouter._handleErrors);

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "../certs/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "../certs/server.cert")),
};

const server = https.createServer(sslOptions, app);

server.listen(constant.PORT, () => {
  console.log(helpers.coloredLog(`[HTTPS] api start. port: ${constant.PORT}`));
});

mongoose.Promise = Promise;
mongoose.connect(constant.MONGO_URL);
mongoose.connection.on("error", (dbErorr: Error) => console.log(dbErorr));

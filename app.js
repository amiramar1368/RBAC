import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config.js"

import { PORT } from "./config.js";
import { models } from "./models/db.js";
import loginRouter from './routes/login.controller.routes.js';
import allRouter from './routes/allroutes.v1.routes.js';
import checkToken from './middlewares/check-token.js';
import errorHandler from './middlewares/errorHandler.js';
import {insertInitialData} from './controllers/initial-data-controller.js';


const app = express();

app.use(cookieParser());
app.use(errorHandler);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use((req, res, next) => {
  req.models = {
    ...models,
  };
  next()
});

setTimeout(()=>{
insertInitialData();
},2000)
app.use("/users/login",loginRouter)
app.use("/api/v1/",checkToken,allRouter)
// app.use("/api/v1/",allRouter)

app.listen(PORT||3100,()=>{console.log(`server is running on port ${PORT}`);})
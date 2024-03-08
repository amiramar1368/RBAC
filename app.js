import express from "express";
import "dotenv/config.js"

import { PORT } from "./config.js";
import { models } from "./models/db.js";
import loginRouter from './routes/login-controller-routes.js';
import allRouter from './routes/allroutes-v1.js';
import checkToken from './middlewares/check-token.js';
import sendResponse from './middlewares/send-response.js';
import sendError from './middlewares/error-handler.js';


const app = express();

app.use(sendResponse);
app.use(sendError);

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use((req, res, next) => {
  req.models = {
    ...models,
  };
  next()
});

app.use("/users/login",loginRouter)
app.use("/api/v1/",checkToken,allRouter)

app.listen(PORT||3100,()=>{console.log(`server is running on port ${PORT}`);})
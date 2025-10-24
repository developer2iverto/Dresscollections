import serverlessExpress from "@vendia/serverless-express";
import app from "../../../backend/app.js";

export const handler = serverlessExpress({ app });
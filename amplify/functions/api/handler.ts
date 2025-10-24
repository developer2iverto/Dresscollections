import serverlessExpress from "@vendia/serverless-express";
// Use CommonJS require to import the existing Express app
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../backend/app");

export const handler = serverlessExpress({ app });
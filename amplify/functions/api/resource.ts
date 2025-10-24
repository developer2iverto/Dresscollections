import { defineFunction } from "@aws-amplify/backend";

// Lambda function entry point that wraps the Express app
export const api = defineFunction({
  name: "store-api",
  entry: "./functions/api/handler.ts",
  timeoutSeconds: 30,
  environment: {
    // Configure these in the Amplify console per environment
    MONGODB_URI: process.env.MONGODB_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || "",
    FRONTEND_URL: process.env.FRONTEND_URL || ""
  }
});
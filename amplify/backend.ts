import { defineBackend } from "@aws-amplify/backend";
import { api } from "./functions/api/resource";

// Define Amplify backend with one Lambda function powering an HTTP API
export const backend = defineBackend({ api });
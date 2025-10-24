import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { CorsHttpMethod, HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { api } from "./functions/api/resource";

// Define Amplify backend with one Lambda function powering an HTTP API
const backend = defineBackend({ api });

const apiStack = backend.createStack("http-api-stack");

// Create an HTTP API and wire Lambda integration
const httpApi = new HttpApi(apiStack, "StoreHttpApi", {
  apiName: "store-http-api",
  corsPreflight: {
    allowHeaders: ["*"],
    allowMethods: [CorsHttpMethod.ANY],
    allowOrigins: ["*"]
  }
});

const integration = new HttpLambdaIntegration("ApiIntegration", api);

// Proxy all /api/* routes to Lambda
httpApi.addRoutes({
  path: "/api/{proxy+}",
  methods: [HttpMethod.ANY],
  integration
});

// Allow the function to access CloudWatch logs and common services
api.addToRolePolicy(new Policy(apiStack, "ApiExtraPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      resources: ["*"]
    })
  ]
}));

export { backend };
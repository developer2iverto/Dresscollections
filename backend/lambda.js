const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app').default;

exports.handler = serverlessExpress({ app });
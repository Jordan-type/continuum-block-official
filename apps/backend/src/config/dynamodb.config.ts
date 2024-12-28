import dynamoose from "dynamoose";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const isProduction = process.env.NODE_ENV === "production";

const setupDynamoDB = () => {
  if (!isProduction) {
    console.log("Running in development mode. Using local DynamoDB...");
    dynamoose.aws.ddb.local("http://localhost:8000");
  } else {
    console.log("Running in production mode. Using AWS DynamoDB...");
    const config = new DynamoDB({
      region: process.env.AWS_REGION || "eu-north-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "your-access-key-id",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "your-secret-access-key",
      }
    });
    
    dynamoose.aws.ddb.set(config);
  }
};

export default setupDynamoDB;

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from "path";
import {Code, Function, Runtime, FunctionUrlAuthType} from "aws-cdk-lib/aws-lambda";
import {CfnOutput} from "aws-cdk-lib";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
////////////////////////////////////////////////////////////////////////////////////////////////////
    // DynamoDB table --> CoorseTable with Partition key course_id
    const course_table = new dynamodb.Table(this, 'CourseTable', { 
      partitionKey: { name: 'course_id', type: dynamodb.AttributeType.STRING }, 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
    });
////////////////////////////////////////////////////////////////////////////////////////////////////
    // GET Lambda
    const get_handler = new Function(this, "RustGETHandler", {
      code: Code.fromAsset(path.join(__dirname, "..", "..", "target/lambda/get")),
      runtime: Runtime.PROVIDED_AL2,
      handler: "does_not_matter",
      environment: {
        TABLE_NAME: course_table.tableName,
        PRIMARY_KEY:'course_id'
      },
      functionName: "rust-api-get"
    });

    const getUrl = get_handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
    new CfnOutput(this, 'GETUrl', {
      value: getUrl.url,
    });
////////////////////////////////////////////////////////////////////////////////////////////////////
    // CREATE Lambda
    const create_handler = new Function(this, "RustCREATEHandler", {
      code: Code.fromAsset(path.join(__dirname, "..", "..", "target/lambda/create")),
      runtime: Runtime.PROVIDED_AL2,
      handler: "does_not_matter",
      environment: {
        TABLE_NAME: course_table.tableName,
        PRIMARY_KEY:'course_id'
      },
      functionName: "rust-api-create"
    });

    const createUrl = create_handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
    new CfnOutput(this, 'CREATEUrl', {
      value: createUrl.url,
    });
////////////////////////////////////////////////////////////////////////////////////////////////////
    // CREATE Lambda
    const get_category_handler = new Function(this, "RustGETCategoryHandler", {
      code: Code.fromAsset(path.join(__dirname, "..", "..", "target/lambda/getByCategory")),
      runtime: Runtime.PROVIDED_AL2,
      handler: "does_not_matter",
      environment: {
        TABLE_NAME: course_table.tableName,
        PRIMARY_KEY:'course_id'
      },
      functionName: "rust-api-get-by-category"
    });

    const getByCategoryUrl = get_category_handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
    new CfnOutput(this, 'GETCategoryUrl', {
      value: getByCategoryUrl.url,
    });
////////////////////////////////////////////////////////////////////////////////////////////////////
    // course_table.grantReadData(get_handler);
    course_table.grantFullAccess(get_handler);
    course_table.grantFullAccess(create_handler);
    course_table.grantFullAccess(get_category_handler);
////////////////////////////////////////////////////////////////////////////////////////////////////

    // API Gateway
    const api = new apigateway.RestApi(this,' RUST API GATEWAY',{
      restApiName:'RUST API GATEWAY'
    });

    const rootApi=api.root.addResource('get');
    const getApiIntegration=new apigateway.LambdaIntegration(get_handler);
    rootApi.addMethod('GET',getApiIntegration);

    const createApi=api.root.addResource('create');
    const createApiIntegration=new apigateway.LambdaIntegration(create_handler);
    createApi.addMethod('POST', createApiIntegration);

    const getByCategoryApi=api.root.addResource('getByCategory');
    const getByCategoryApiIntegration=new apigateway.LambdaIntegration(get_category_handler);
    getByCategoryApi.addMethod('GET', getByCategoryApiIntegration);

////////////////////////////////////////////////////////////////////////////////////////////////////
  }

}

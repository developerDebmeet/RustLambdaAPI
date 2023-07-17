# Rust Lambda API

This repository contains a RESTful API implemented in Rust, which performs Create and Read operations for a "Course" entity. Each Course has three attributes:

- `course_id`
- `course_name`
- `course_category`

---

## Development
1. Write/Edit Rust code in the *src/bin* folder

2. Format the Rust code using :
    ```bash
    cargo fmt 
    ```
3. Compile binaries of the Rust Code :
    ```bash
    cargo lambda build --release
    ```

---

## Deployment

The infrastructure is provisioned using AWS CDK.

To deploy the API, follow these steps:

1. Navigate to the `deploy` directory:
   ```bash
   cd deploy
    ```
2. Install the required dependencies:
    ```bash
   npm install
    ```
3. Generate the CloudFormation template using CDK:
    ```bash
   cdk synth
    ```
4. Deploy the infrastructure using CDK:
    ```bash
   cdk deploy
    ```
This will create the necessary AWS resources, including:

- Three Lambdas: `getById`, `getByCategory`, and `create`, each with its own Function URL.
- One DynamoDB table: `CourseTable`.
- One API Gateway with three endpoints: `/get`, `/getByCategory`, and `/create`.

The Lambdas are implemented using three separate Rust handlers, each compiled into a binary.

---

## Prerequisites


Before developing/deploying the API, make sure you have the following prerequisites:

- Rust compiler installed on your system.
- AWS CDK installed.
- Cargo Lambda installed.
---
## References

Here are some references that I found helpful and also want to give credit to:

- https://dynobase.dev/dynamodb-aws-cdk/
- https://github.com/Durgaprasad-Budhwani/rust-based-aws-lambda-example
- https://www.youtube.com/watch?v=uhE3Z2lGGXQ
- https://www.udemy.com/course/aws-lambda-serverless/
- https://bobbyhadz.com/blog/aws-cdk-api-gateway-example
- https://www.youtube.com/watch?v=T-H4nJQyMig

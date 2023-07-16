use aws_config::meta::region::RegionProviderChain;
use aws_sdk_dynamodb::model::AttributeValue;
use aws_sdk_dynamodb::Client;
use lambda_runtime::{handler_fn, Context, Error as LambdaError};
use serde::Deserialize;
use serde_json::{json, Value};
use std::env;
use std::println;
use uuid::Uuid;

#[tokio::main]
async fn main() -> Result<(), LambdaError> {
    let func = handler_fn(handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

#[derive(Deserialize, Debug)]
struct CourseEvent {
    course_name: String,
    course_category: String,
}

async fn handler(event: CourseEvent, _: Context) -> Result<Value, LambdaError> {
    let course_id = Uuid::new_v4().to_string();
    let id = course_id.clone();

    let ddb_table_name: String = env::var("TABLE_NAME").unwrap();
    println!("Received Event: {:?}", event);

    let region_provider = RegionProviderChain::default_provider().or_else("ap-south-1");
    let config = aws_config::from_env().region(region_provider).load().await;
    let client = Client::new(&config);

    let request = client
        .put_item()
        .table_name(ddb_table_name)
        .item("course_id", AttributeValue::S(String::from(course_id)))
        .item(
            "course_name",
            AttributeValue::S(String::from(event.course_name)),
        )
        .item(
            "course_category",
            AttributeValue::S(String::from(event.course_category)),
        );

    request.send().await?;

    Ok(json!({
        "New Course Created Successfully with course_id": id
    }))
}

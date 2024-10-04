use axum::{
    Router, routing::{get, post},
    http::StatusCode,
    response::IntoResponse,
    Json,
};

use serde_json::json;
use crate::models::user::User;

pub fn routes() -> Router {
    Router::new()
        .route("/get-users", get(get_users))
        .route("/create-user", post(create_user))
}

async fn get_users() -> impl IntoResponse {
    (StatusCode::OK, "Return all users")
}

async fn create_user(
    Json(payload): Json<User>
) -> impl IntoResponse {
    tracing::warn!("eeeeeeeeeeee {:?}",payload );
    (StatusCode::CREATED, "Return create user")
}


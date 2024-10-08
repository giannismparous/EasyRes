use crate::firebase::client::FirebaseDB;
use crate::models::user::User;
use crate::AppError;
use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};

pub fn routes() -> Router {
    Router::new()
        .route("/get-users", get(get_users))
        .route("/create-user", post(create_user))
}

async fn get_users() -> impl IntoResponse {
    (StatusCode::OK, "Return all users")
}

async fn create_user(
    Extension(firebase): Extension<FirebaseDB>,
    Json(payload): Json<User>,
) -> Result<(), AppError> {
    tracing::warn!("Payload: {:?}", payload);
    firebase.create_user(&payload).await
}

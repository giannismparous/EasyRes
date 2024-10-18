use crate::firebase::client::FirebaseDB;
use crate::models::user::User;
use crate::AppError;
use axum::extract::Path;
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
        .route("/get-user-by-id/:id", get(get_user_by_id))
        .route("/get-user-by-name/:username", get(get_user_by_name))
        .route("/get-user-by-email/:email", get(get_user_by_email))
}

async fn get_users(
    Extension(firebase): Extension<FirebaseDB>
) -> impl IntoResponse {
    tracing::warn!("Get users is here!");

    let response = firebase.get_users().await;
    (StatusCode::OK, "Return all users")
    // TO DO
    // Please complete here the return json for users
}

async fn create_user(
    Extension(firebase): Extension<FirebaseDB>,
    Json(payload): Json<User>,
) -> Result<(), AppError> {
    tracing::warn!("Payload: {:?}", payload);
    firebase.create_user(&payload).await
}

async fn get_user_by_id(
    Extension(firebase): Extension<FirebaseDB>,
    Path(id): Path<String>,
) -> Result<Json<User>, AppError> {
    tracing::warn!("Get user with id {}", id);
    let response = firebase.get_user_by_id(&id).await?;
    Ok(Json(response))
}

async fn get_user_by_name(
    Extension(firebase): Extension<FirebaseDB>,
    Path(username): Path<String>,
) -> Result<Json<User>, AppError> {
    let response = firebase.get_user_by_name(&username).await?;
    if response.is_none() {
        return Err(AppError::UserNotFound(username))
    }
    Ok(Json(response.unwrap()))
}

async fn get_user_by_email(
    Extension(firebase): Extension<FirebaseDB>,
    Path(email): Path<String>,
) -> Result<Json<User>, AppError> {
    let response = firebase.get_user_by_email(&email).await?;
    if response.is_none() {
        return Err(AppError::UserNotFound(email))
    }
    Ok(Json(response.unwrap()))
}
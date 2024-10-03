use std::env;
use std::sync::Arc;
use axum::{
    Extension, Router,
    http::StatusCode,
    routing::{get, post},
};
use axum::response::IntoResponse;
use tokio::sync::broadcast;

pub struct AppState {
    tx: broadcast::Sender<String>,
}

pub fn routes() -> Router {
    let (tx, _rx) = broadcast::channel(100);

    let app_state = Arc::new(AppState { tx });

    Router::new()
        .route("/health-check", get(health_check))

}
pub async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, "Service is healthy")
}
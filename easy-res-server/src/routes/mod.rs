pub mod handler;
mod restaurant;
mod user;

use axum::Router;
// use crate::routes::{handler, user, restaurant};

pub fn routes() -> Router {
    Router::new()
        .merge(handler::routes()) // Κοινά endpoints
        .nest("/api/user", user::routes()) // User-related endpoints
        .nest("/api/restaurant", restaurant::routes()) // Restaurant-related endpoints
}

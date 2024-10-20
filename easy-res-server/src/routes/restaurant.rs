use axum::{http::StatusCode, response::IntoResponse, routing::get, Router};

pub fn routes() -> Router {
    Router::new().route("/", get(get_restaurants).post(create_restaurant)) // Τα routes για εστιατόρια
}

async fn get_restaurants() -> impl IntoResponse {
    (StatusCode::OK, "Returning all restaurants")
}

async fn create_restaurant() -> impl IntoResponse {
    (StatusCode::CREATED, "Restaurant created")
}

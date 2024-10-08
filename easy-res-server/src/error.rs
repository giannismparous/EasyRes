use std::convert::Infallible;
use {
    axum::{
        http::StatusCode,
        response::{IntoResponse, Response},
        Json,
    },
    serde_json::json,
};

pub type Result<T> = std::result::Result<T, AppError>;

#[derive(thiserror::Error, Debug)]
pub enum AppError {
    #[error("Value not found")]
    NotFound,
    #[error("Configuration Error {0}")]
    Config(#[from] config::ConfigError),
    #[error("Could not start service: {0}")]
    Startup(String),
    #[error("Could not stop service")]
    TcpBind,
    #[error("Not found user with id: {0}")]
    UserNotFound(String),
    #[error("Not found firebase {0}")]
    Firebase(#[from] Infallible),
    #[error("Set user error {0}")]
    FirebaseError(#[from] firebase_rs::RequestError),
    #[error("Url parse error {0}")]
    UrlParseError(#[from] firebase_rs::UrlParseError),
    #[error("Unexpected error: {0}")]
    Unexpected(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            Self::NotFound => (StatusCode::NOT_FOUND, "Resource not Found"),
            Self::Config(_)
            | Self::Startup(_)
            | Self::Firebase(_)
            | Self::FirebaseError(_)
            | Self::UrlParseError(_)
            | Self::TcpBind
            | Self::Unexpected(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Unexpected error"),
            Self::UserNotFound(_) => {
                unreachable!("This error can only occur during startup")
            }
        };

        let body = Json(json!({ "error": error_message }));
        (status, body).into_response()
    }
}

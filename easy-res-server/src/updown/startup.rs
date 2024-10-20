use std::net::TcpListener;
use {
    axum::{routing::IntoMakeService, Extension, Router, Server},
    hyper::server::conn::AddrIncoming,
    tower_http::trace::TraceLayer,
};

use axum::body::BoxBody;
use http::Response;
use std::time::Duration;
use tracing::Span;

use hyper::{Body, Request};
use tower_http::trace::DefaultOnRequest;
use tower_request_id::RequestId;
// use tracing_wrapper::tracing::{self, Level};
use tracing::Level;

use crate::firebase::client::FirebaseDB;
use crate::{
    error::{AppError, Result},
    routes,
};

pub fn run(listener: TcpListener) -> Result<Server<AddrIncoming, IntoMakeService<Router>>> {
    let firebase = FirebaseDB::new()?;
    let router = routes::routes();
    let app = router
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request<Body>| {
                    let request_id = request
                        .extensions()
                        .get::<RequestId>()
                        .map(ToString::to_string)
                        .unwrap_or_else(|| "unknown".into());

                    tracing::info_span!(
                        "request",
                        id = %request_id,
                        method = %request.method(),
                        uri = %request.uri()
                    )
                })
                .on_request(DefaultOnRequest::new().level(Level::INFO)),
        )
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|_request: &Request<Body>| tracing::info_span!("response"))
                .on_response(
                    |_response: &Response<BoxBody>, _latency: Duration, _span: &Span| {
                        tracing::info!("response generated");
                    },
                ),
        )
        .layer(Extension(firebase));

    Ok(axum::Server::from_tcp(listener)
        .or(Err(AppError::TcpBind))?
        .serve(app.into_make_service()))
}

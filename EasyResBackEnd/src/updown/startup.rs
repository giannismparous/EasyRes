use std::net::TcpListener;
use std::net::SocketAddr;
use {
    axum::{
        middleware, routing::IntoMakeService,
        Router, Server,
        Extension
    },
    hyper::server::conn::AddrIncoming,
    tower_http::trace::TraceLayer,
};

use axum::body::BoxBody;
use http::Response;
use std::time::Duration;
use tracing::Span;

use hyper::{Body, Request};
use tower_http::trace::DefaultOnRequest;
use tower_request_id::{RequestId, RequestIdLayer};
// use tracing_wrapper::tracing::{self, Level};
use tracing::Level;

use crate::{
  error::{AppError, Result}, routes::handler
};
pub fn run(
    listener: TcpListener,
) -> Result<Server<AddrIncoming, IntoMakeService<Router>>> {
    let router = handler::routes();
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
                .on_response(|_response: &Response<BoxBody>, _latency: Duration, _span: &Span| {
                    tracing::info!("response generated");
                }),
        );



    Ok(axum::Server::from_tcp(listener)
        .or(Err(AppError::TcpBind))?
        .serve(app.into_make_service()))

}
use std::env;
use std::net::IpAddr;
use std::net::SocketAddr;
use once_cell::sync::Lazy;
use EasyResBackEnd::{
    error::{AppError, Result},
    config::CONFIG
};


#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    let config = Lazy::force(&CONFIG)
        .as_ref()
        .map_err(|err| AppError::Startup(err.to_string()))?;

    println!("Hello world {:?}", config);
    Ok(())
}
use once_cell::sync::Lazy;
use std::net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener};

use easy_res_server::{
    config::CONFIG,
    error::{AppError, Result},
    updown::startup,
};

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    let config = Lazy::force(&CONFIG)
        .as_ref()
        .map_err(|err| AppError::Startup(err.to_string()))?;

    println!("Hello world {:?}", config);

    // set the address
    let addr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), config.port);
    tracing::info!("Listening on {}", addr);
    let listener = TcpListener::bind(addr).or(Err(AppError::TcpBind))?;

    startup::run(listener)?
        .await
        .map_err(|e| AppError::Startup(e.to_string()))?;

    Ok(())
}

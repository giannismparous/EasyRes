mod builder;
use crate::error::Result;
use builder::ConfigBuilder;

use {once_cell::sync::Lazy, serde::Deserialize};

pub static CONFIG: Lazy<Result<AppConfig>> = Lazy::new(AppConfig::read_config_for_env);

#[derive(Deserialize, Debug, Clone)]
/// This app's config
pub struct AppConfig {
    pub port: u16,
    pub sentry_key: Option<String>,
    pub metrics_port: u16,
}

impl<'de> ConfigBuilder<'de> for AppConfig {
    type Config = AppConfig;
}
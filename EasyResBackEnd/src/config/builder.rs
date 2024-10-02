//! Handle the configuration of various dependencies
use std::{borrow::Cow, env};

use config::{Config, Environment, File};
use serde::Deserialize;
// use tracing_subscriber;

use crate::error::Result;

pub trait ConfigBuilder<'de> {
    type Config: Deserialize<'de>;

    fn get_env_or_default<'a>(env_var: &str, default: &'a str) -> Cow<'a, str> {
        match env::var(env_var) {
            Ok(v) => Cow::Owned(v),
            Err(err) => {
                tracing::error!("Server error: {:?}", err);
                Cow::Borrowed(default)
            }
        }
    }

    fn get_configs_path<'a>() -> Cow<'a, str> {
        Self::get_env_or_default(
            "RUST_CONFIG_PATH",
            concat!(env!("CARGO_MANIFEST_DIR"), "/configs"),
        )
    }

    fn get_config_filename<'a>() -> Cow<'a, str> {
        // TODO: extract to/find an env crate that is not re-allocating for defaults and gets'
        Self::get_env_or_default("RUST_ENV", "local")
    }

    fn read_config(paths: &[impl AsRef<str> + std::fmt::Debug]) -> Result<Self::Config> {
        let mut s = Config::builder();
        tracing::info!("paths: {:?}", paths);
        for path in paths {
            s = s.add_source(File::with_name(path.as_ref()).required(true));
        }
        let extra_config = format!("{}/extra.json", Self::get_configs_path());
        s = s.add_source(File::with_name(extra_config.as_ref()).required(false));
        s = s.add_source(
            Environment::with_prefix("CONFIG")
                .separator("__")
                .ignore_empty(true),
        );
        Ok(s.build()?.try_deserialize()?)
    }

    fn read_config_for_env() -> Result<Self::Config> {
        let target = format!(
            "{}/{}.json",
            Self::get_configs_path(),
            Self::get_config_filename()
        );

        let conf = Self::read_config(&[target])?;

        Ok(conf)
    }
}
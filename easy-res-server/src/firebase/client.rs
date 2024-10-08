use crate::{config::CONFIG, models, AppError};
use models::user::User;
use std::sync::Arc;

use config::ConfigError;
use firebase_rs::Firebase;
use once_cell::sync::Lazy;

static POOLS: Lazy<Result<Arc<Firebase>, AppError>> = Lazy::new(|| {
    let config_1 = Lazy::force(&CONFIG)
        .as_ref()
        .map_err(|e| ConfigError::Message(e.to_string()))?;

    let firebase = Firebase::new(&config_1.firebase.url)?;
    Ok(Arc::new(firebase))
});

#[derive(Clone)]
pub struct FirebaseDB {
    pub firebase: Arc<Firebase>,
}

impl FirebaseDB {
    pub fn new() -> Result<Self, AppError> {
        let firebase = Lazy::force(&POOLS)
            .as_ref()
            .map_err(|err| ConfigError::Message(err.to_string()))?
            .clone();

        Ok(FirebaseDB { firebase })
    }

    pub async fn create_user(&self, user: &User) -> Result<(), AppError> {
        let firebase_ref = self.firebase.at("users");

        let response = firebase_ref.set::<User>(user).await?;
        tracing::info!("user created: {:?}", response);

        Ok(())
    }
}

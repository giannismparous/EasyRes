use std::collections::HashMap;
use crate::{config::CONFIG, models, AppError};
use models::user::User;
use std::sync::Arc;
use axum::response::Response;
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
        let users = self.get_users().await?;
        for (_, existing_user) in users.iter() {
            if existing_user.username == user.username {
                return Err(AppError::UsernameAlreadyExists(user.username.clone()));
            }
            if existing_user.email == user.email {
                return Err(AppError::EmailAlreadyExists(user.email.clone()));
            }
        }

        let firebase_ref = self.firebase.at("users");

        let response = firebase_ref.set::<User>(user).await?;
        tracing::info!("user created: {:?}", response);

        Ok(())
    }

    pub async fn get_users(&self) -> Result<HashMap<String, User>, AppError> {
        let firebase_ref = self.firebase.at("users");

        Ok( firebase_ref
            .get::<HashMap<String, User>>()  // Expect a HashMap from Firebase
            .await                           // Wait for the async call
            .map_err(|err| AppError::StringError(err.to_string()))?)
    }

    pub async fn get_user_by_id(&self, id: &String) -> Result<User, AppError> {
        let firebase_ref = self.firebase.at(&format!("users/{}", id));

        Ok( firebase_ref
            .get::<User>()  // Expect to retrieve a User from Firebase
            .await          // Await the async operation
            .map_err(|err| AppError::UserNotFound(err.to_string()))?)
    }

    pub async fn get_user_by_email(&self, email: &String) -> Result<Option<User>, AppError> {
        let users = self.get_users().await?;

        for (_, user) in users.iter() {
            if user.email == email.to_string() {
                return Ok(Some(user.clone()));  // Return the found user
            }
        }

        // If don't find user
        Ok(None)
    }

    pub async fn get_user_by_name(&self, username: &String) -> Result<Option<User>, AppError> {
        let users = self.get_users().await?;
        for (_, user) in users.iter() {
            if user.username == username.to_string() {
                return Ok(Some(user.clone()));
            }
        }
        Ok(None)
    }
}

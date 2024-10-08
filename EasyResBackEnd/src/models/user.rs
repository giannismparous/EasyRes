use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    #[serde(skip_serializing_if = "Option::is_none")] // If is none
    #[serde(skip_deserializing)] // Skip the deserialize for Id
    pub id: Option<Uuid>,

    pub username: String,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub is_active: bool,
    pub is_admin: bool,
}

impl User {
    pub fn new(
        username: String,
        firstname: String,
        lastname: String,
        email: String,
        is_active: bool,
        is_admin: bool,
    ) -> User {
        User {
            id: Some(Uuid::new_v4()),
            username,
            firstname,
            lastname,
            email,
            is_active,
            is_admin,
        }
    }

    pub fn is_active(&self) -> bool {
        self.is_active
    }

    pub fn is_admin(&self) -> bool {
        self.is_admin
    }
}

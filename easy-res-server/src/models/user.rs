use serde::{Deserialize, Serialize};
use chrono::NaiveDate;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    #[serde(skip_deserializing)]
    pub id: String,
    pub username: String,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub birthdate: NaiveDate,
    pub is_active: bool,
    pub is_admin: bool,
}

impl User {
    pub fn new(
        id: String,
        username: String,
        firstname: String,
        lastname: String,
        email: String,
        birthdate: NaiveDate,
        is_active: bool,
        is_admin: bool,
    ) -> User {
        User {
            id,
            username,
            firstname,
            lastname,
            email,
            birthdate,
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

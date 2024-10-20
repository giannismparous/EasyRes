use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserDTO {
    pub username: String,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub birthdate: NaiveDate,
    pub password: String,
    pub is_active: bool,
    pub is_admin: bool,
}
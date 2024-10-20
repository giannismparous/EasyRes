use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateUserDTO {
    pub id: String,
    pub username: String,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub email: Option<String>,
    pub birthdate: Option<NaiveDate>,
    pub current_password: Option<String>,
    pub new_password: Option<String>,
}
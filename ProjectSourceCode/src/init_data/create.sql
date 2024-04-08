DROP TABLE IF EXISTS users;
CREATE TABLE users (
    email VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);
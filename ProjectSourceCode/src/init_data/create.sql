DROP TABLE IF EXISTS users;
CREATE TABLE users (
    email VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL,
    name VARCHAR(40),
    location VARCHAR(50),
    bio VARCHAR(200)
);
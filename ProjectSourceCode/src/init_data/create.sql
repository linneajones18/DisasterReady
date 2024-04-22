DROP TABLE IF EXISTS users;
CREATE TABLE users (
    email VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

CREATE TABLE incident_reports (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    incident_type VARCHAR(255),
    details TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
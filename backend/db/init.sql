
CREATE DATABASE IF NOT EXISTS supermarket;

\c supermarket;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  cpf VARCHAR(20) NOT NULL,
  photo VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  promo_price NUMERIC(12,2),
  promo_expires_at DATE,
  type VARCHAR(100),
  description TEXT,
  expires_at DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

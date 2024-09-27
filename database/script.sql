-- Exclui a tabela de comidas se já existir
DROP TABLE IF EXISTS foods;

-- Exclui a tabela de refeições se já existir
DROP TABLE IF EXISTS meals;

-- Exclui a tabela de cardápios se já existir
DROP TABLE IF EXISTS menus;

-- Exclui a tabela de usuários se já existir
DROP TABLE IF EXISTS users;

-- Criação da tabela de usuários
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    weight FLOAT NOT NULL,
    height FLOAT NOT NULL,
    gender VARCHAR(50) NOT NULL,
    activity_level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de cardápios, garantindo que o usuário só possa ter um cardápio
CREATE TABLE menus (
    menu_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, -- UNIQUE para garantir que cada usuário tenha apenas um menu
    menu_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Criação da tabela de refeições
CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    menu_id INT NOT NULL,
    meal_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(menu_id) ON DELETE CASCADE
);

-- Criação da tabela de comidas
CREATE TABLE foods (
    food_id SERIAL PRIMARY KEY,
    meal_id INT NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    calories INT,
    quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_id) REFERENCES meals(meal_id) ON DELETE CASCADE
);

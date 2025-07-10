CREATE TABLE order_recipe (
    id SERIAL PRIMARY KEY,
    ingredient_id INT[] NOT NULL,
    total REAL NOT NULL
);

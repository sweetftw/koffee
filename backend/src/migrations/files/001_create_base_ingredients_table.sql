-- Create Base Ingredients table
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    ingredient VARCHAR(100) NOT NULL,
    additional BOOLEAN NOT NULL,
    price REAL NOT NULL
);

-- Insert sample data
INSERT INTO ingredients (ingredient, additional, price) VALUES 
    ('Expresso', FALSE, 5.00),
    ('Leite', FALSE, 2.50),
    ('Chocolate', FALSE, 4.00),
    ('Sorvete', FALSE, 6.00),
    ('Espuma', FALSE, 1.50),
    ('Caramelo', TRUE, 2.00),
    ('Calda de Chocolate', TRUE, 2.00),
    ('Chantilly', TRUE, 2.50),
    ('Canela', TRUE, 1.00);
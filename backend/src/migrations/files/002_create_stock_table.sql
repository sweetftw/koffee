-- Create Stock table
CREATE TABLE stock (
    id SERIAL,
    ingredient_id INT NOT NULL,
    amount INT NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_ingredient
      FOREIGN KEY(ingredient_id)
        REFERENCES ingredients(id)
);

-- Insert sample data
INSERT INTO stock (ingredient_id, amount) VALUES 
    ( 1, 70),
    ( 2, 5),
    ( 3, 40),
    ( 4, 30),
    ( 5, 60),
    ( 6, 50),
    ( 7, 60),
    ( 8, 50),
    ( 9, 50);
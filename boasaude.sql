CREATE TABLE products (
  id INT  PRIMARY KEY,
  brand VARCHAR(50),
  name VARCHAR(150),
  description TEXT,
  price DECIMAL(10,2),
  image VARCHAR(255),
  category VARCHAR(50)
);
INSERT INTO products (brand, name, description, price, image, category) VALUES
('BrandA', 'Product 1', 'Description for Product 1', 19.99, 'product1.jpg', 'Category1'),
('BrandB', 'Product 2', 'Description for Product 2', 29.99, 'product2.jpg', 'Category2'),
('BrandC', 'Product 3', 'Description for Product 3', 39.99, 'product3.jpg', 'Category1'),
('BrandD', 'Product 4', 'Description for Product 4', 49.99, 'product4.jpg', 'Category3'),
('BrandE', 'Product 5', 'Description for Product 5', 59.99, 'product5.jpg', 'Category2');

CREATE TABLE users (
  id INT  PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (username, password, email) VALUES
('user1', 'password1'),
('user2', 'password2'),
('user3', 'password3');
CREATE TABLE orders (
  id INT  PRIMARY KEY,
  user_id INT,
  total DECIMAL(10,2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO orders (user_id, total, status) VALUES
(1, 59.98, 'Pending'),
(2, 29.99, 'Completed'),
(3, 19.99, 'Shipped');

CREATE TABLE order_items (
  id INT  PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 19.99),
(2, 2, 1, 29.99),
(3, 3, 1, 19.99);
CREATE TABLE reviews (
  id INT  PRIMARY KEY,
  product_id INT,
  user_id INT,
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Great product!'),
(2, 2, 4, 'Very good quality.'),
(3, 3, 3, 'Average product.');
CREATE TABLE categories (
  id INT  PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  description TEXT
);

INSERT INTO categories (name, description) VALUES
('Category1', 'Description for Category 1'),
('Category2', 'Description for Category 2'),
('Category3', 'Description for Category 3');
CREATE TABLE suppliers (
  id INT  PRIMARY KEY,
  name VARCHAR(100),
  contact_name VARCHAR(100),
  contact_email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT
);


CREATE TABLE product_suppliers (
  product_id INT,
  supplier_id INT,
  PRIMARY KEY (product_id, supplier_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

create table Terapeutas(
  id_terapeuta int, 
  cedula_terapeuta int,
  nome_terapeuta VARCHAR(50), 
  PRIMARY KEY (id_terapeuta, cedula_terapeuta)
); 

CREATE TABLE Rycompt(
 id_Rycompt int, 
 fornecedor_rycompt VARCHAR(50), 
 nome_equipamento VARCHAR(50),
 PRIMARY KEY (id_Rycompt)
); 

INSERT INTO Rycompt (id_Rycompt, nome_equipamento) VALUES
('1', 'NLS'),
('2', 'Hunter'),
('3', '--');


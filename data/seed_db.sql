-- USERS (restent à 2)
INSERT INTO "user" (first_name, last_name, password, email, role)
VALUES 
('Alice', 'Dupont', 'hashed_pwd1', 'alice@example.com', 'member'),
('Bob', 'Martin', ' MonSuperMdpAdmin123!', 'bob@example.com', 'admin');

-- RECETTES
INSERT INTO recipe (title, image, description, instruction, duration, difficulty, cost, user_id)
VALUES
('Spaghetti Carbonara', 'carbonara.jpg', 'Un classique italien.', 'Faire revenir les lardons, cuire les pâtes...', 25, 'Facile', 'Petit budget', 1),
('Tarte aux pommes', 'tarte_pommes.jpg', 'Tarte gourmande aux pommes.', 'Préparer une pâte brisée, disposer les pommes...', 45, 'Moyen', 'Rapport qualité prix', 2),
('Curry de légumes', 'curry_legumes.jpg', 'Un plat végétarien savoureux.', 'Faire revenir les légumes avec les épices...', 40, 'Moyen', 'Petit budget', 1),
('Poulet rôti', 'poulet_roti.jpg', 'Simple et efficace.', 'Assaisonner le poulet, enfourner 1h à 180°C.', 60, 'Facile', 'Rapport qualité prix', 2),
('Riz cantonnais', 'riz_cantonnais.jpg', 'Recette asiatique rapide.', 'Faire revenir le riz avec les légumes et l’œuf...', 30, 'Facile', 'Petit budget', 1),
('Brownie chocolat', 'brownie.jpg', 'Dessert fondant au chocolat.', 'Faire fondre chocolat, mélanger, cuire.', 35, 'Facile', 'Couteux', 2);

-- CATÉGORIES
INSERT INTO category (name, recipe_id)
VALUES
('Italien', 1),
('Dessert', 2),
('Végétarien', 3),
('Viande', 4),
('Asiatique', 5),
('Dessert', 6);

-- INGRÉDIENTS
INSERT INTO ingredient (name, unity)
VALUES
('Spaghetti', 'g'),
('Lardons', 'g'),
('Œufs', 'pièce'),
('Parmesan', 'g'),
('Pommes', 'pièce'),
('Sucre', 'g'),
('Farine', 'g'),
('Carottes', 'g'),
('Courgettes', 'g'),
('Pois chiches', 'g'),
('Poulet', 'kg'),
('Riz', 'g'),
('Petits pois', 'g'),
('Chocolat noir', 'g'),
('Beurre', 'g');

-- QUANTITÉS
INSERT INTO quantity (recipe_id, ingredient_id, quantity)
VALUES
-- Carbonara
(1, 1, 200),
(1, 2, 100),
(1, 3, 2),
(1, 4, 50),

-- Tarte aux pommes
(2, 5, 3),
(2, 6, 100),
(2, 7, 200),
(2, 3, 1),

-- Curry de légumes
(3, 8, 100),
(3, 9, 100),
(3, 10, 150),
(3, 3, 1),

-- Poulet rôti
(4, 11, 1),
(4, 6, 20),

-- Riz cantonnais
(5, 12, 200),
(5, 13, 50),
(5, 3, 1),
(5, 2, 30),

-- Brownie
(6, 14, 200),
(6, 6, 100),
(6, 7, 100),
(6, 15, 100),
(6, 3, 2);

-- MÉDIAS
INSERT INTO media (title, type, description, label, recipe_id)
VALUES
('Photo Carbonara', 'image', 'Plat terminé', 'principal', 1),
('Vidéo Tarte', 'video', 'Tuto complet', 'étapes', 2),
('Photo Curry', 'image', 'Servi avec riz', 'final', 3),
('Image Poulet', 'image', 'En cuisson', 'four', 4),
('Vidéo Riz', 'video', 'Rapide et efficace', 'explication', 5),
('Photo Brownie', 'image', 'Zoom texture', 'appétissant', 6);

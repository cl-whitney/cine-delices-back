-- USERS (restent à 2)

-- RECETTES
INSERT INTO recipe (title, image, description, instruction, duration, difficulty, cost, user_id)
VALUES
('Spaghetti Carbonara', 'https://cdn.pixabay.com/photo/2011/04/29/11/20/spaghetti-7113_960_720.jpg', 'Un classique italien.', 'Faire revenir les lardons, cuire les pâtes...', 25, 'Facile', 'Petit budget', 1),
('Tarte aux pommes', 'https://cdn.pixabay.com/photo/2014/12/03/17/26/apple-pie-555624_960_720.jpg', 'Tarte gourmande aux pommes.', 'Préparer une pâte brisée, disposer les pommes...', 45, 'Moyen', 'Rapport qualité prix', 2),
('Curry de légumes', 'https://img.mesrecettesfaciles.fr/2019-04/curry-de-legumes-vjw-1200.webp', 'Un plat végétarien savoureux.', 'Faire revenir les légumes avec les épices...', 40, 'Moyen', 'Petit budget', 1),
('Poulet rôti', 'https://cdn.pixabay.com/photo/2016/11/08/10/39/chicken-1807883_960_720.jpg', 'Simple et efficace.', 'Assaisonner le poulet, enfourner 1h à 180°C.', 60, 'Facile', 'Rapport qualité prix', 2),
('Riz cantonnais', 'https://assets.afcdn.com/recipe/20130909/41109_w1024h768c1cx1936cy1296.jpg', 'Recette asiatique rapide.', 'Faire revenir le riz avec les légumes et l’œuf...', 30, 'Facile', 'Petit budget', 1),
('Brownie chocolat', 'https://cdn.pixabay.com/photo/2018/04/24/20/12/dessert-3347905_960_720.jpg', 'Dessert fondant au chocolat.', 'Faire fondre chocolat, mélanger, cuire.', 35, 'Facile', 'Couteux', 2);

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
('Ratatouille', 'film', 'Un hommage à la cuisine française à travers l’histoire d’un rat chef.', 'principal', 1),
('Julie & Julia', 'film', 'Deux époques, deux femmes, une passion commune pour la cuisine.', 'étapes', 2),
('Chef', 'film', 'Un chef redécouvre sa passion pour la cuisine en lançant son propre food truck.', 'final', 3),
('The Bear', 'série', 'Un chef talentueux tente de sauver le restaurant familial en plein chaos.', 'four', 4),
('The Hundred-Foot Journey', 'film', 'Une rencontre entre la gastronomie indienne et la haute cuisine française.', 'explication', 5),
('Cooked', 'série', 'Une exploration de la cuisine sous toutes ses formes à travers la science et l’histoire.', 'appétissant', 6);

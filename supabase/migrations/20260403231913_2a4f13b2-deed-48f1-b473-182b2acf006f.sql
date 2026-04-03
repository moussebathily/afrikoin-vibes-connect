
-- Temporarily allow insert for seeding
CREATE POLICY "seed_wallpapers" ON public.wallpapers FOR INSERT WITH CHECK (true);

-- Insert 16 demo wallpapers (one per category) using Unsplash images
INSERT INTO public.wallpapers (user_id, title, description, file_url, category_id, media_type, width, height, is_featured, tags) VALUES
-- Afrique
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Coucher de soleil sur le Serengeti', 'Magnifique coucher de soleil africain sur les plaines du Serengeti', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=80', '3b7d26f4-c400-4e23-a566-55647f80d331', 'image', 1920, 1080, true, ARRAY['afrique', 'serengeti', 'coucher de soleil']),
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Baobab majestueux', 'Un baobab solitaire dans la savane africaine', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80', '3b7d26f4-c400-4e23-a566-55647f80d331', 'image', 1920, 1080, true, ARRAY['afrique', 'baobab', 'savane']),
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Village africain coloré', 'Maisons colorées dans un village traditionnel', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=80', '3b7d26f4-c400-4e23-a566-55647f80d331', 'image', 1920, 1080, false, ARRAY['afrique', 'village', 'couleurs']),

-- Nature
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Cascades tropicales', 'Chute d''eau dans une forêt tropicale luxuriante', 'https://images.unsplash.com/photo-1432405972618-c6b0cfba5cdc?w=1920&q=80', '0d50edf7-3ae8-4fa9-9c13-d130f7e6af60', 'image', 1920, 1080, true, ARRAY['nature', 'cascade', 'forêt']),
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Forêt de bambous', 'Forêt dense de bambous verts', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80', '0d50edf7-3ae8-4fa9-9c13-d130f7e6af60', 'image', 1920, 1080, false, ARRAY['nature', 'bambou', 'vert']),

-- Animaux
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Lion majestueux', 'Portrait d''un lion dans la savane', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1920&q=80', '3030c20f-3995-49fd-8d2e-ba1652ecd0b9', 'image', 1920, 1080, true, ARRAY['animaux', 'lion', 'safari']),
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Éléphant au crépuscule', 'Éléphant marchant au coucher du soleil', 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1920&q=80', '3030c20f-3995-49fd-8d2e-ba1652ecd0b9', 'image', 1920, 1080, false, ARRAY['animaux', 'éléphant', 'crépuscule']),

-- Art
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Art tribal africain', 'Motifs tribaux colorés et géométriques', 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=1920&q=80', 'e4678a0b-1994-43f9-886e-8440fd2f2a0e', 'image', 1920, 1080, true, ARRAY['art', 'tribal', 'motifs']),
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Masque africain traditionnel', 'Masque en bois sculpté traditionnel', 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=1920&q=80', 'e4678a0b-1994-43f9-886e-8440fd2f2a0e', 'image', 1920, 1080, false, ARRAY['art', 'masque', 'tradition']),

-- Espace
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Voie lactée sur l''Afrique', 'Ciel étoilé spectaculaire', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80', '69d64f81-e922-4c96-848d-f2751c480cbc', 'image', 1920, 1080, true, ARRAY['espace', 'étoiles', 'voie lactée']),

-- Architecture
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Mosquée de Djenné', 'La grande mosquée de Djenné au Mali', 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920&q=80', 'e3df3473-a677-40a3-ba77-de1ebfaf0959', 'image', 1920, 1080, true, ARRAY['architecture', 'mosquée', 'mali']),

-- Voyage
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Plage de Zanzibar', 'Eaux turquoise de Zanzibar', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=80', 'b4e55793-cfef-450e-be08-894247972248', 'image', 1920, 1080, true, ARRAY['voyage', 'plage', 'zanzibar']),

-- Sport
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Football africain', 'Match de football dans un stade africain', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80', '1faf48a1-120c-477e-8624-c29d6b74f799', 'image', 1920, 1080, false, ARRAY['sport', 'football', 'stade']),

-- Musique
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Djembé africain', 'Tambour djembé traditionnel', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1920&q=80', '98338c37-b593-4b0a-b83a-80a8d4223c69', 'image', 1920, 1080, false, ARRAY['musique', 'djembé', 'percussion']),

-- Abstrait
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Motifs Kente', 'Tissu Kente aux couleurs vives du Ghana', 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=1920&q=80', 'b2c96a4f-2a96-44e9-8693-1ab62d7c2b07', 'image', 1920, 1080, true, ARRAY['abstrait', 'kente', 'ghana']),

-- Technologie
('f3c1ab0a-8ad0-4fd4-b74f-a39ef09f779a', 'Tech Africa', 'Innovation technologique en Afrique', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80', 'b19251f4-b234-482b-b5ff-8d38b6c93a62', 'image', 1920, 1080, false, ARRAY['technologie', 'innovation', 'afrique']);

-- Clean up temp policy
DROP POLICY "seed_wallpapers" ON public.wallpapers;

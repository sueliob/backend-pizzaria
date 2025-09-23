-- ==============================================
-- SCRIPT DE POPULAÇÃO PARA BANCO NEON - PIZZARIA
-- Arquivo SQL completo para upload direto no Neon Database
-- ==============================================

-- Limpar dados existentes (opcional - remover se quiser manter dados)
DELETE FROM pizza_flavors;
DELETE FROM extras;
DELETE FROM dough_types;
DELETE FROM pizzeria_settings;
DELETE FROM admin_users;

-- ==============================================
-- 1. SABORES DE PIZZA (PIZZA_FLAVORS)
-- ==============================================

INSERT INTO pizza_flavors (id, name, description, prices, category, image_url, available) VALUES
-- PIZZAS SALGADAS GRANDES
('8a1b2c3d-4e5f-6789-abcd-ef1234567890', 'Margherita', 'Molho de tomate artesanal, mussarela de búfala, manjericão fresco e azeite extra virgem', '{"grande": "35.00", "individual": "25.00"}', 'salgadas', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', true),
('9b2c3d4e-5f67-8901-bcde-f23456789012', 'Calabresa Especial', 'Molho de tomate, mussarela, calabresa artesanal, cebola roxa e orégano', '{"grande": "38.00", "individual": "28.00"}', 'salgadas', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', true),
('0c3d4e5f-6789-0123-cdef-456789012345', 'Pepperoni Premium', 'Molho de tomate temperado, mussarela, pepperoni importado e parmesão', '{"grande": "40.00", "individual": "30.00"}', 'salgadas', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', true),
('1d4e5f67-8901-2345-def0-123456789abc', 'Quatro Queijos', 'Mussarela, provolone, gorgonzola, parmesão e ervas finas', '{"grande": "45.00", "individual": "32.00"}', 'salgadas', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400', true),
('2e5f6789-0123-4567-f012-3456789abcde', 'Portuguesa', 'Presunto, ovos, cebola, azeitona preta, pimentão e mussarela', '{"grande": "48.00", "individual": "35.00"}', 'salgadas', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true),
('3f678901-2345-6789-0123-456789abcdef', 'Frango Catupiry', 'Frango desfiado temperado, catupiry original, milho e azeitona', '{"grande": "42.00", "individual": "30.00"}', 'salgadas', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', true),
('4g789012-3456-7890-1234-56789abcdef0', 'Bacon & Cheddar', 'Molho barbecue, mussarela, bacon crocante, cheddar e cebola caramelizada', '{"grande": "46.00", "individual": "33.00"}', 'salgadas', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', true),
('5h890123-4567-8901-2345-6789abcdef01', 'Vegetariana', 'Molho de tomate, mussarela, abobrinha, berinjela, tomate cereja e rúcula', '{"grande": "38.00", "individual": "28.00"}', 'salgadas', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400', true),
('6i901234-5678-9012-3456-789abcdef012', 'Napolitana', 'Molho de tomate, mussarela, tomate fatiado, alho e manjericão', '{"grande": "36.00", "individual": "26.00"}', 'salgadas', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', true),
('7j012345-6789-0123-4567-89abcdef0123', 'Palmito', 'Molho de tomate, mussarela, palmito refogado, azeitona e tomate seco', '{"grande": "41.00", "individual": "29.00"}', 'salgadas', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true),

-- PIZZAS DOCES
('8k123456-7890-1234-5678-9abcdef01234', 'Chocolate com Morango', 'Chocolate ao leite derretido, morangos frescos e leite condensado', '{"media": "28.00", "individual": "20.00"}', 'doces', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', true),
('9l234567-8901-2345-6789-abcdef012345', 'Brigadeiro', 'Chocolate, granulado, leite condensado e cereja', '{"media": "30.00", "individual": "22.00"}', 'doces', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400', true),
('0m345678-9012-3456-7890-bcdef0123456', 'Romeu e Julieta', 'Queijo cremoso, goiabada cascão e canela', '{"media": "26.00", "individual": "18.00"}', 'doces', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', true),
('1n456789-0123-4567-8901-cdef01234567', 'Banana com Canela', 'Banana caramelizada, canela, açúcar mascavo e queijo', '{"media": "25.00", "individual": "17.00"}', 'doces', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400', true),

-- ENTRADAS
('2o567890-1234-5678-9012-def012345678', 'Pão de Alho Tradicional', 'Pão italiano, alho refogado, queijo mussarela gratinado', '{"individual": "12.00"}', 'entradas', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', true),
('3p678901-2345-6789-0123-ef0123456789', 'Pão de Alho com Catupiry', 'Pão italiano, alho, catupiry original e ervas', '{"individual": "15.00"}', 'entradas', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', true),
('4q789012-3456-7890-1234-f01234567890', 'Bruschetta', 'Pão italiano, tomate fresco, manjericão, alho e azeite', '{"individual": "14.00"}', 'entradas', 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400', true),

-- BEBIDAS
('5r890123-4567-8901-2345-012345678901', 'Coca-Cola 350ml', 'Refrigerante gelado', '{"individual": "5.50"}', 'bebidas', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true),
('6s901234-5678-9012-3456-123456789012', 'Coca-Cola 600ml', 'Refrigerante gelado - tamanho família', '{"individual": "8.00"}', 'bebidas', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true),
('7t012345-6789-0123-4567-234567890123', 'Guaraná Antarctica 350ml', 'Refrigerante gelado', '{"individual": "5.00"}', 'bebidas', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true),
('8u123456-7890-1234-5678-345678901234', 'Água Mineral 500ml', 'Água mineral gelada', '{"individual": "3.50"}', 'bebidas', 'https://images.unsplash.com/photo-1550572017-ebe9c04eadc1?w=400', true),
('9v234567-8901-2345-6789-456789012345', 'Suco de Laranja 300ml', 'Suco natural gelado', '{"individual": "6.00"}', 'bebidas', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', true),
('0w345678-9012-3456-7890-567890123456', 'Cerveja Heineken 350ml', 'Cerveja gelada', '{"individual": "8.50"}', 'bebidas', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', true);

-- ==============================================
-- 2. EXTRAS (ADICIONAIS)
-- ==============================================

INSERT INTO extras (id, name, description, price, category, available) VALUES
-- EXTRAS SALGADOS
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Queijo Extra', 'Mussarela adicional', 5.00, 'salgadas', true),
('b2c3d4e5-f678-9012-3456-7890abcdef01', 'Bacon', 'Bacon crocante fatiado', 8.00, 'salgadas', true),
('c3d4e5f6-7890-1234-5678-90abcdef0123', 'Calabresa', 'Calabresa fatiada', 6.00, 'salgadas', true),
('d4e5f678-9012-3456-7890-abcdef012345', 'Catupiry', 'Catupiry original', 7.00, 'salgadas', true),
('e5f67890-1234-5678-9012-bcdef0123456', 'Frango Desfiado', 'Frango temperado e desfiado', 7.50, 'salgadas', true),
('f6789012-3456-7890-1234-cdef01234567', 'Azeitona Preta', 'Azeitonas pretas sem caroço', 4.00, 'salgadas', true),
('g7890123-4567-8901-2345-def012345678', 'Cebola', 'Cebola fatiada refogada', 3.00, 'salgadas', true),
('h8901234-5678-9012-3456-ef0123456789', 'Palmito', 'Palmito refogado', 6.50, 'salgadas', true),
('i9012345-6789-0123-4567-f01234567890', 'Tomate Seco', 'Tomate seco temperado', 5.50, 'salgadas', true),
('j0123456-7890-1234-5678-012345678901', 'Rúcula', 'Rúcula fresca', 4.50, 'salgadas', true),
('k1234567-8901-2345-6789-123456789012', 'Parmesão', 'Queijo parmesão ralado', 6.00, 'salgadas', true),
('l2345678-9012-3456-7890-234567890123', 'Ovo', 'Ovo cozido fatiado', 3.50, 'salgadas', true),

-- EXTRAS DOCES
('m3456789-0123-4567-8901-345678901234', 'Chocolate Extra', 'Chocolate ao leite adicional', 4.00, 'doces', true),
('n4567890-1234-5678-9012-456789012345', 'Morango', 'Morangos frescos fatiados', 6.00, 'doces', true),
('o5678901-2345-6789-0123-567890123456', 'Leite Condensado', 'Leite condensado extra', 3.50, 'doces', true),
('p6789012-3456-7890-1234-678901234567', 'Granulado', 'Granulado colorido', 2.50, 'doces', true),
('q7890123-4567-8901-2345-789012345678', 'Banana', 'Banana fatiada', 4.00, 'doces', true),
('r8901234-5678-9012-3456-890123456789', 'Canela', 'Canela em pó', 2.00, 'doces', true);

-- ==============================================
-- 3. TIPOS DE MASSA (DOUGH_TYPES)
-- ==============================================

INSERT INTO dough_types (id, name, description, price, category, available) VALUES
-- MASSAS SALGADAS
('s9012345-6789-0123-4567-901234567890', 'Massa Tradicional', 'Massa clássica italiana, crocante e saborosa', 0.00, 'salgadas', true),
('t0123456-7890-1234-5678-012345678901', 'Massa Integral', 'Massa integral com fibras, mais saudável', 3.00, 'salgadas', true),
('u1234567-8901-2345-6789-123456789012', 'Massa com Orégano', 'Massa temperada com orégano e ervas', 2.50, 'salgadas', true),
('v2345678-9012-3456-7890-234567890123', 'Borda Catupiry', 'Massa com borda recheada de catupiry', 8.00, 'salgadas', true),
('w3456789-0123-4567-8901-345678901234', 'Borda Cheddar', 'Massa com borda recheada de cheddar', 7.50, 'salgadas', true),

-- MASSAS DOCES
('x4567890-1234-5678-9012-456789012345', 'Massa Doce', 'Massa doce especial para pizzas doces', 0.00, 'doces', true),
('y5678901-2345-6789-0123-567890123456', 'Massa com Açúcar e Canela', 'Massa doce com açúcar e canela', 3.50, 'doces', true);

-- ==============================================
-- 4. CONFIGURAÇÕES DA PIZZARIA (PIZZERIA_SETTINGS)
-- ==============================================

INSERT INTO pizzeria_settings (id, section, data) VALUES
-- INFORMAÇÕES DO NEGÓCIO
('z6789012-3456-7890-1234-678901234567', 'business_hours', '{
  "monday": {"open": "18:00", "close": "23:30", "closed": false},
  "tuesday": {"open": "18:00", "close": "23:30", "closed": false},
  "wednesday": {"open": "18:00", "close": "23:30", "closed": false},
  "thursday": {"open": "18:00", "close": "23:30", "closed": false},
  "friday": {"open": "18:00", "close": "00:30", "closed": false},
  "saturday": {"open": "18:00", "close": "00:30", "closed": false},
  "sunday": {"open": "18:00", "close": "23:00", "closed": false}
}'),

-- INFORMAÇÕES DE CONTATO
('a7890123-4567-8901-2345-789012345678', 'contact', '{
  "phone": "(11) 99999-9999",
  "whatsapp": "5511999999999",
  "email": "contato@pizzariaexemplo.com.br",
  "website": "www.pizzariaexemplo.com.br"
}'),

-- ENDEREÇO
('b8901234-5678-9012-3456-890123456789', 'address', '{
  "street": "Rua das Pizzas, 123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "coordinates": {"lat": -23.5505, "lng": -46.6333}
}'),

-- CONFIGURAÇÕES DE ENTREGA
('c9012345-6789-0123-4567-901234567890', 'delivery', '{
  "freeDeliveryMinimum": 50.00,
  "deliveryFee": 8.00,
  "maxDeliveryDistance": 10,
  "estimatedTime": {"min": 30, "max": 45},
  "areas": [
    {"name": "Centro", "fee": 5.00},
    {"name": "Zona Sul", "fee": 8.00},
    {"name": "Zona Norte", "fee": 10.00}
  ]
}'),

-- INFORMAÇÕES DA MARCA
('d0123456-7890-1234-5678-012345678901', 'branding', '{
  "name": "Pizzaria Exemplo",
  "slogan": "A melhor pizza da cidade!",
  "description": "Desde 1995 preparando as melhores pizzas com ingredientes frescos e massa artesanal.",
  "logo": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200",
  "backgroundUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
  "colors": {
    "primary": "#DC2626",
    "secondary": "#059669",
    "accent": "#F59E0B"
  }
}'),

-- REDES SOCIAIS
('e1234567-8901-2345-6789-123456789012', 'social', '{
  "instagram": "@pizzariaexemplo",
  "facebook": "PizzeriaExemplo",
  "twitter": "@pizzariaex",
  "youtube": "PizzeriaExemploOficial"
}'),

-- CATEGORIAS DE PRODUTOS
('f2345678-9012-3456-7890-234567890123', 'categories', '{
  "salgadas": {
    "name": "Pizzas Salgadas",
    "description": "Nossas deliciosas pizzas salgadas com ingredientes frescos",
    "icon": "pizza",
    "order": 1
  },
  "doces": {
    "name": "Pizzas Doces",
    "description": "Pizzas doces irresistíveis para sobremesa",
    "icon": "candy",
    "order": 2
  },
  "entradas": {
    "name": "Entradas",
    "description": "Aperitivos deliciosos para começar bem sua refeição",
    "icon": "appetizer",
    "order": 3
  },
  "bebidas": {
    "name": "Bebidas",
    "description": "Bebidas geladas para acompanhar sua pizza",
    "icon": "drink",
    "order": 4
  }
}');

-- ==============================================
-- 5. USUÁRIO ADMIN INICIAL
-- ==============================================

-- Senha: pizzaria123 (hash bcrypt)
INSERT INTO admin_users (id, username, email, password_hash, role, is_active) VALUES
('g3456789-0123-4567-8901-345678901234', 'admin', 'admin@pizzaria.com', '$2b$12$7yX6n/2bv0cxGGlrlwEpPutwUDqBvBnM/2mDskqnjDR2XKBZsJh1K', 'admin', true);

-- ==============================================
-- FINALIZAÇÃO
-- ==============================================

-- Commit das transações
COMMIT;

-- Verificação dos dados inseridos
SELECT 'Pizza Flavors' as tabela, count(*) as total FROM pizza_flavors
UNION ALL
SELECT 'Extras' as tabela, count(*) as total FROM extras  
UNION ALL
SELECT 'Dough Types' as tabela, count(*) as total FROM dough_types
UNION ALL
SELECT 'Settings' as tabela, count(*) as total FROM pizzeria_settings
UNION ALL
SELECT 'Admin Users' as tabela, count(*) as total FROM admin_users;

-- ==============================================
-- INSTRUÇÕES DE USO:
-- ==============================================
-- 1. Faça upload deste arquivo no Neon Database
-- 2. Execute o script completo
-- 3. Configure as variáveis de ambiente:
--    READ_ONLY_MODE=false (para permitir admin)
--    ENABLE_AUTO_SEED=false (não precisa mais)
-- 4. Login admin: admin / pizzaria123
-- 5. Depois de configurar tudo, ative READ_ONLY_MODE=true
-- ==============================================
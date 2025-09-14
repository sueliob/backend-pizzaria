// Script para testar conexão Neon e popular dados
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada');
  process.exit(1);
}

console.log('🔗 Testando conexão Neon...');
console.log('📍 URL:', DATABASE_URL.substring(0, 50) + '...');

const sql = neon(DATABASE_URL);

async function testConnection() {
  try {
    // Teste básico de conexão
    console.log('1️⃣ Testando conexão...');
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Conexão OK:', result[0].current_time);

    // Verificar tabelas existentes
    console.log('2️⃣ Verificando estrutura...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 Tabelas encontradas:', tables.map(t => t.table_name));

    // Verificar dados em pizza_flavors
    console.log('3️⃣ Verificando dados...');
    const flavors = await sql`SELECT COUNT(*) as count FROM pizza_flavors`;
    console.log('🍕 Sabores no banco:', flavors[0].count);

    if (flavors[0].count === '0') {
      console.log('⚠️ Banco vazio! Populando dados...');
      await populateData();
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('🔍 Detalhes:', error);
  }
}

async function populateData() {
  try {
    console.log('📥 Inserindo sabores...');
    
    // Inserir alguns sabores básicos
    await sql`
      INSERT INTO pizza_flavors (id, name, description, prices, category, image_url, available) VALUES
      ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Margherita', 'Molho de tomate, mussarela de búfala, manjericão fresco', '{"grande": "35.00", "individual": "25.00"}', 'salgadas', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', true),
      ('b2c3d4e5-f678-9012-3456-7890abcdef01', 'Calabresa', 'Molho de tomate, mussarela, calabresa artesanal', '{"grande": "38.00", "individual": "28.00"}', 'salgadas', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', true),
      ('c3d4e5f6-7890-1234-5678-90abcdef0123', 'Pepperoni', 'Molho de tomate, mussarela, pepperoni importado', '{"grande": "40.00", "individual": "30.00"}', 'salgadas', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', true),
      ('d4e5f678-9012-3456-7890-abcdef012345', 'Chocolate', 'Chocolate ao leite, morangos frescos', '{"media": "28.00", "individual": "20.00"}', 'doces', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', true),
      ('e5f67890-1234-5678-9012-bcdef0123456', 'Pão de Alho', 'Pão italiano com alho e queijo', '{"individual": "12.00"}', 'entradas', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', true),
      ('f6789012-3456-7890-1234-cdef01234567', 'Coca-Cola', 'Refrigerante gelado 350ml', '{"individual": "5.50"}', 'bebidas', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true)
      ON CONFLICT (name) DO NOTHING
    `;

    // Verificar inserção
    const newCount = await sql`SELECT COUNT(*) as count FROM pizza_flavors`;
    console.log('✅ Dados inseridos! Total sabores:', newCount[0].count);

    // Testar por categoria
    const salgadas = await sql`SELECT COUNT(*) as count FROM pizza_flavors WHERE category = 'salgadas'`;
    const doces = await sql`SELECT COUNT(*) as count FROM pizza_flavors WHERE category = 'doces'`;
    const bebidas = await sql`SELECT COUNT(*) as count FROM pizza_flavors WHERE category = 'bebidas'`;
    const entradas = await sql`SELECT COUNT(*) as count FROM pizza_flavors WHERE category = 'entradas'`;

    console.log('📊 Por categoria:');
    console.log('  🍕 Salgadas:', salgadas[0].count);
    console.log('  🍰 Doces:', doces[0].count);
    console.log('  🥖 Entradas:', entradas[0].count);
    console.log('  🥤 Bebidas:', bebidas[0].count);

  } catch (error) {
    console.error('❌ Erro ao popular dados:', error.message);
  }
}

testConnection();
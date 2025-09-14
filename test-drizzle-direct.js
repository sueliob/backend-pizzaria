// Test direct drizzle connection (como Netlify usa)
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import * as schema from './shared/schema.js';

console.log('🧪 Testing Drizzle connection (like Netlify)...');

// Configure like production
neonConfig.poolQueryViaFetch = true;
neonConfig.useSecureWebSocket = true;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: true, // Force SSL
  max: 10,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 5000,
  query_timeout: 30000,
  statement_timeout: 30000,
  application_name: 'pizzaria-test'
});

const db = drizzle({ client: pool, schema });

try {
  console.log('1️⃣ Testing connection...');
  
  // Test like DatabaseStorage.getAllFlavors()
  console.log('2️⃣ Getting all flavors...');
  const allFlavors = await db.select().from(schema.pizzaFlavors).where(eq(schema.pizzaFlavors.available, true));
  console.log('✅ All flavors count:', allFlavors.length);
  
  // Test like DatabaseStorage.getFlavorsByCategory()
  console.log('3️⃣ Getting salgadas...');
  const salgadas = await db.select().from(schema.pizzaFlavors)
    .where(eq(schema.pizzaFlavors.category, 'salgadas') && eq(schema.pizzaFlavors.available, true));
  console.log('✅ Salgadas count:', salgadas.length);
  console.log('🍕 Salgadas names:', salgadas.slice(0, 3).map(f => f.name));
  
  // Test other categories
  const doces = await db.select().from(schema.pizzaFlavors)
    .where(eq(schema.pizzaFlavors.category, 'doces') && eq(schema.pizzaFlavors.available, true));
  console.log('🍰 Doces count:', doces.length);
  
  console.log('✅ Drizzle connection working!');
  
} catch (error) {
  console.error('❌ Drizzle error:', error.message);
  console.error('Stack:', error.stack);
} finally {
  await pool.end();
}
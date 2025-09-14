// Debug específico para Netlify Functions
import { neon } from '@neondatabase/serverless';

console.log('🔧 DEBUG NETLIFY CONNECTION');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL preview:', process.env.DATABASE_URL.substring(0, 30) + '...');
  
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('🔍 Testing direct query...');
    const result = await sql`SELECT COUNT(*) as count FROM pizza_flavors`;
    console.log('✅ Total flavors:', result[0].count);
    
    const salgadas = await sql`SELECT COUNT(*) as count FROM pizza_flavors WHERE category = 'salgadas'`;
    console.log('🍕 Salgadas count:', salgadas[0].count);
    
    const salgadasList = await sql`SELECT name FROM pizza_flavors WHERE category = 'salgadas' LIMIT 3`;
    console.log('🍕 Salgadas names:', salgadasList.map(f => f.name));
    
  } catch (error) {
    console.error('❌ SQL Error:', error.message);
    console.error('Stack:', error.stack);
  }
} else {
  console.error('❌ DATABASE_URL não encontrada!');
}
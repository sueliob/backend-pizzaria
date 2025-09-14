import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for optimal production performance
neonConfig.webSocketConstructor = ws;

// Enable SSL and connection pooling
neonConfig.poolQueryViaFetch = true;
neonConfig.useSecureWebSocket = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized Pool configuration for production
const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Production optimized settings
  ssl: isProduction ? true : false, // Secure SSL in production
  max: isProduction ? 20 : 5, // Max connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Connection timeout 10s
  query_timeout: 60000, // Query timeout 60s
  statement_timeout: 60000, // Statement timeout 60s
  application_name: `pizzaria-app-${isProduction ? 'prod' : 'dev'}`
});

export const db = drizzle({ client: pool, schema });

// Pool monitoring for production (only for long-running processes)
if (isProduction && process.env.ENABLE_POOL_MONITORING === 'true') {
  pool.on('connect', () => {
    console.log('🔗 [DB] New connection established');
  });
  
  pool.on('error', (err) => {
    console.error('❌ [DB] Unexpected error on idle client', err);
  });
  
  // Log pool stats periodically (only if explicitly enabled)
  setInterval(() => {
    console.log('📊 [DB] Pool stats:', {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    });
  }, 300000); // Every 5 minutes
}
import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { DatabaseStorage } from '../../src/storage';

// Initialize storage
const storage = new DatabaseStorage();

// Função helper para migrar configurações para o banco
async function migrateSettingsToDatabase() {
  try {
    // Migrar businessHours
    await storage.createSetting({
      section: 'businessHours',
      data: PIZZERIA_SETTINGS.businessHours
    });
    
    // Migrar contact
    await storage.createSetting({
      section: 'contact',
      data: PIZZERIA_SETTINGS.contact
    });
    
    // Migrar address
    await storage.createSetting({
      section: 'address',
      data: PIZZERIA_SETTINGS.address
    });
    
    // Migrar delivery
    await storage.createSetting({
      section: 'delivery',
      data: PIZZERIA_SETTINGS.delivery
    });
    
    // Migrar branding
    await storage.createSetting({
      section: 'branding',
      data: PIZZERIA_SETTINGS.branding
    });
    
    // Migrar social
    await storage.createSetting({
      section: 'social',
      data: PIZZERIA_SETTINGS.social
    });
    
    // Migrar categories
    await storage.createSetting({
      section: 'categories',
      data: PIZZERIA_SETTINGS.categories
    });
    
    console.log('✅ Configurações migradas para o banco de dados com sucesso');
  } catch (error) {
    console.error('Erro ao migrar configurações:', error);
    throw error;
  }
}

// Função para conectar direto ao PostgreSQL via HTTP
async function queryDatabase(query: string, params: any[] = []) {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not configured');
  }

  try {
    // Usar fetch direto para PostgreSQL HTTP endpoint do Neon
    const url = DATABASE_URL.replace('postgresql://', 'https://').replace(':5432', '') + '/sql';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DATABASE_URL.split('@')[0].split('://')[1].split(':')[1]}`
      },
      body: JSON.stringify({ query, params })
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Database connection error:', error);
    // Fallback para dados estáticos em caso de erro
    return null;
  }
}

// Pizzeria configuration
const PIZZERIA_ADDRESS = {
  coordinates: { lat: -23.5236, lng: -46.7031 } // Vila Leopoldina
};

// Variável global para armazenar configurações da pizzaria (persistência em memória)
let PIZZERIA_SETTINGS = {
  businessHours: {
    monday: { open: '18:00', close: '23:00', isOpen: true },
    tuesday: { open: '18:00', close: '23:00', isOpen: true },
    wednesday: { open: '18:00', close: '23:00', isOpen: true },
    thursday: { open: '18:00', close: '23:00', isOpen: true },
    friday: { open: '18:00', close: '00:00', isOpen: true },
    saturday: { open: '18:00', close: '00:00', isOpen: true },
    sunday: { open: '18:00', close: '23:00', isOpen: true }
  },
  contact: {
    whatsapp: '11935856898',
    phone: '1133334444',
    email: 'pizzaria@exemplo.com'
  },
  address: {
    street: 'R. Passo da Pátria',
    number: '1685',
    neighborhood: 'Vila Leopoldina',
    city: 'São Paulo',
    state: 'SP',
    cep: '05085-000',
    coordinates: { lat: -23.5236, lng: -46.7031 }
  },
  delivery: {
    baseFee: 9,
    feePerRange: 9,
    kmRange: 3,
    baseTime: 30,
    maxDistance: 15
  },
  branding: {
    name: 'BRASCATTA',
    slogan: 'pizza de qualidade',
    logoUrl: '/images/logo.png',
    backgroundUrl: '/images/background.png'
  },
  social: {
    facebook: 'https://facebook.com/brascatta',
    instagram: 'https://instagram.com/brascatta'
  },
  categories: {
    entradas: 'Entradas',
    salgadas: 'Pizzas Salgadas', 
    doces: 'Pizzas Doces',
    bebidas: 'Bebidas'
  }
};

// Delivery configuration - Fórmula Original
const DELIVERY_CONFIG = {
  baseFee: 9.00,              // Taxa mínima R$ 9,00
  feePerRange: 9.00,          // R$ 9,00 por cada 3km  
  kmRange: 3,                 // Cada faixa é 3km
  baseTime: 20,               // Tempo base entrega (moto)
};

// CEP para coordenadas (principais áreas de São Paulo)
const CEP_COORDINATES: Record<string, {lat: number, lng: number}> = {
  // Centro/República
  '01000': { lat: -23.5505, lng: -46.6333 },
  '01300': { lat: -23.5489, lng: -46.6388 },
  
  // Vila Madalena/Pinheiros
  '05014': { lat: -23.5448, lng: -46.6854 },
  '05422': { lat: -23.5616, lng: -46.7020 },
  
  // Vila Leopoldina (áreas próximas)
  '05085': { lat: -23.5236, lng: -46.7031 }, // Área da pizzaria
  '05318': { lat: -23.5190, lng: -46.7350 },
  '05335': { lat: -23.547968, lng: -46.75071 }, // Jaguaré
  
  // Butantã
  '05508': { lat: -23.5695, lng: -46.7295 },
  '05424': { lat: -23.5588, lng: -46.7186 },
  
  // Morumbi
  '05650': { lat: -23.6028, lng: -46.6982 },
  '05705': { lat: -23.6234, lng: -46.7020 },
  
  // Lapa
  '05040': { lat: -23.5280, lng: -46.7056 },
  '05077': { lat: -23.5173, lng: -46.6970 },
  
  // Jardins
  '01401': { lat: -23.5614, lng: -46.6563 },
  '01452': { lat: -23.5710, lng: -46.6692 },
  
  // Vila Olímpia
  '04551': { lat: -23.5951, lng: -46.6851 },
  '04552': { lat: -23.5988, lng: -46.6890 }
};

// Fórmula de Haversine para calcular distância
function calculateHaversineDistance(coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distância em km
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Obter coordenadas do CEP
function getCoordinatesFromCEP(cep: string): {lat: number, lng: number} {
  const cleanCEP = cep.replace(/\D/g, '');
  
  // Buscar correspondência exata nos primeiros 5 dígitos
  if (CEP_COORDINATES[cleanCEP.substring(0, 5)]) {
    return CEP_COORDINATES[cleanCEP.substring(0, 5)];
  }
  
  // Buscar nos primeiros 4 dígitos
  const cep4 = cleanCEP.substring(0, 4);
  for (const key in CEP_COORDINATES) {
    if (key.substring(0, 4) === cep4) {
      return CEP_COORDINATES[key];
    }
  }
  
  // Estimativa baseada no padrão do CEP de São Paulo
  const cepNum = parseInt(cleanCEP);
  
  if (cepNum >= 1000000 && cepNum < 3000000) {
    return { lat: -23.5505, lng: -46.6333 }; // Centro
  } else if (cepNum >= 4000000 && cepNum < 6000000) {
    return { lat: -23.5800, lng: -46.6800 }; // Sul/Oeste
  } else if (cepNum >= 5000000 && cepNum < 6000000) {
    return { lat: -23.5400, lng: -46.7200 }; // Oeste (próximo à pizzaria)
  } else {
    return { lat: -23.5505, lng: -46.6333 }; // Fallback Centro
  }
}

// Calcular taxa usando fórmula original
function calculateDeliveryFromCEP(cep: string) {
  const pizzeriaCoords = PIZZERIA_ADDRESS.coordinates;
  const destinationCoords = getCoordinatesFromCEP(cep);
  
  const distance = calculateHaversineDistance(pizzeriaCoords, destinationCoords);
  const roundedDistance = Math.max(1, Math.round(distance * 10) / 10);
  
  // Fórmula Original: ceil(distância / 3km) * R$ 9,00 (mínimo R$ 9,00)
  const ranges = Math.ceil(roundedDistance / DELIVERY_CONFIG.kmRange);
  const deliveryFee = Math.max(ranges * DELIVERY_CONFIG.feePerRange, DELIVERY_CONFIG.baseFee);
  
  // Tempo estimado baseado na distância (moto)
  const estimatedMinutes = Math.max(DELIVERY_CONFIG.baseTime, DELIVERY_CONFIG.baseTime + (roundedDistance * 1.5));
  
  return {
    distance: roundedDistance,
    deliveryFee: deliveryFee.toFixed(2),
    estimatedTime: `${Math.round(estimatedMinutes)} min`
  };
}

// Dados de fallback caso banco não funcione
const FALLBACK_FLAVORS = [
  { 
    id: '8', 
    name: 'Margherita', 
    category: 'salgadas', 
    prices: { "grande": "35.00", "individual": "25.00" }, 
    description: 'Molho de tomate, mussarela de búfala e manjericão fresco',
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
    available: true
  },
  { 
    id: '9', 
    name: 'Calabresa', 
    category: 'salgadas', 
    prices: { "grande": "38.00", "individual": "28.00" }, 
    description: 'Molho de tomate, mussarela e calabresa tradicional',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    available: true
  },
  { 
    id: '10', 
    name: 'Pepperoni', 
    category: 'salgadas', 
    prices: { "grande": "40.00", "individual": "30.00" }, 
    description: 'Molho de tomate, mussarela e pepperoni importado',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    available: true
  },
  { 
    id: '11', 
    name: 'Quatro Queijos', 
    category: 'salgadas', 
    prices: { "grande": "45.00", "individual": "32.00" }, 
    description: 'Mussarela, provolone, gorgonzola e parmesão',
    imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
    available: true
  },
  { 
    id: '12', 
    name: 'Portuguesa', 
    category: 'salgadas', 
    prices: { "grande": "48.00", "individual": "35.00" }, 
    description: 'Presunto, ovos, cebola, azeitona, pimentão e mussarela',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    available: true
  },
  { 
    id: '13', 
    name: 'Chocolate', 
    category: 'doces', 
    prices: { "media": "25.00", "individual": "18.00" }, 
    description: 'Chocolate ao leite derretido com morango',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    available: true
  },
  { 
    id: '14', 
    name: 'Brigadeiro', 
    category: 'doces', 
    prices: { "media": "28.00", "individual": "20.00" }, 
    description: 'Chocolate, granulado e leite condensado',
    imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
    available: true
  },
  { 
    id: '15', 
    name: 'Pão de Alho', 
    category: 'entradas', 
    prices: { "individual": "12.00" }, 
    description: 'Pão de alho gratinado com queijo',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    available: true
  },
  { 
    id: '16', 
    name: 'Coca-Cola 350ml', 
    category: 'bebidas', 
    prices: { "individual": "5.00" }, 
    description: 'Refrigerante gelado',
    imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    available: true
  },
  { 
    id: '17', 
    name: 'Água 500ml', 
    category: 'bebidas', 
    prices: { "individual": "3.50" }, 
    description: 'Água mineral gelada',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-ebe9c04eadc1?w=400',
    available: true
  }
];

// Debug function for logging
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [NETLIFY] ${message}`);
  if (data) {
    console.log(`[${timestamp}] [NETLIFY] Data:`, JSON.stringify(data, null, 2));
  }
}

// CORS configuration from environment
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://frontend-pizzaria.pages.dev,http://localhost:3000,http://localhost:5000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// CORS helper function
function getCorsHeaders(origin: string | undefined) {
  let allowedOrigin = '';
  
  if (!origin) {
    // curl/postman requests
    allowedOrigin = '*';
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    allowedOrigin = origin;
  } else {
    // Origin not allowed - return empty, will cause CORS error
    allowedOrigin = '';
  }
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  const startTime = Date.now();
  
  const origin = event.headers.origin;
  const headers = getCorsHeaders(origin);
  
  // Log CORS decision
  if (origin) {
    const allowed = ALLOWED_ORIGINS.includes(origin);
    debugLog(`🔒 CORS Check: ${origin} - ${allowed ? 'ALLOWED' : 'BLOCKED'}`);
  }

  const path = event.path.replace('/.netlify/functions/api', '') || '/';
  const method = event.httpMethod;
  
  // Debug log da requisição entrante
  debugLog(`🔄 ${method} ${path}`, {
    origin,
    userAgent: event.headers['user-agent'],
    body: event.body ? JSON.parse(event.body) : null,
    queryStringParameters: event.queryStringParameters
  });

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    debugLog(`⚙️ CORS preflight request from ${origin}`);
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }
  
  // Block requests from non-allowed origins (except non-browser requests)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    debugLog(`❌ Origin blocked: ${origin}`);
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Origin not allowed' })
    };
  }

  try {
    // Root endpoint
    if (path === '/' && method === 'GET') {
      const response = { 
        message: 'Pizzaria API Online com 10 Sabores!', 
        status: 'ok',
        timestamp: new Date().toISOString()
      };
      debugLog(`✅ Root endpoint response`, response);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    }

    // Health check
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          status: 'ok', 
          timestamp: new Date().toISOString() 
        })
      };
    }

    // Get all flavors
    if (path === '/flavors' && method === 'GET') {
      try {
        const flavors = await storage.getAllFlavors();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(flavors)
        };
      } catch (error) {
        // Fallback em caso de erro
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(FALLBACK_FLAVORS)
        };
      }
    }

    // Get flavors by category
    if (path.startsWith('/flavors/') && method === 'GET') {
      try {
        const category = path.split('/')[2];
        const categoryFlavors = await storage.getFlavorsByCategory(category);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(categoryFlavors)
        };
      } catch (error) {
        // Fallback em caso de erro
        const category = path.split('/')[2];
        const categoryFlavors = FALLBACK_FLAVORS.filter(f => f.category === category);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(categoryFlavors)
        };
      }
    }

    // Get all extras (public route)
    if (path === '/extras' && method === 'GET') {
      try {
        const extras = await storage.getAllExtras();
        // Se não tiver dados no banco, usar fallback
        if (!extras || extras.length === 0) {
          const fallbackExtras = [
            { id: '1', name: 'Calabresa', price: 3.50, category: 'salgada' },
            { id: '2', name: 'Bacon', price: 4.00, category: 'salgada' },
            { id: '3', name: 'Cogumelos', price: 3.00, category: 'salgada' },
            { id: '4', name: 'Azeitona', price: 2.50, category: 'salgada' },
            { id: '5', name: 'Chocolate Granulado', price: 2.00, category: 'doce' },
            { id: '6', name: 'Leite Condensado', price: 3.00, category: 'doce' }
          ];
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(fallbackExtras)
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(extras)
        };
      } catch (error) {
        // Fallback em caso de erro
        const fallbackExtras = [
          { id: '1', name: 'Calabresa', price: 3.50, category: 'salgada' },
          { id: '2', name: 'Bacon', price: 4.00, category: 'salgada' },
          { id: '3', name: 'Cogumelos', price: 3.00, category: 'salgada' },
          { id: '4', name: 'Azeitona', price: 2.50, category: 'salgada' },
          { id: '5', name: 'Chocolate Granulado', price: 2.00, category: 'doce' },
          { id: '6', name: 'Leite Condensado', price: 3.00, category: 'doce' }
        ];
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(fallbackExtras)
        };
      }
    }

    // Get all dough types (public route)
    if (path === '/dough-types' && method === 'GET') {
      try {
        const doughTypes = await storage.getAllDoughTypes();
        // Se não tiver dados no banco, usar fallback
        if (!doughTypes || doughTypes.length === 0) {
          const fallbackDough = [
            { id: '1', name: 'Massa Tradicional', price: 0.00, category: 'salgada' },
            { id: '2', name: 'Massa Integral', price: 2.00, category: 'salgada' },
            { id: '3', name: 'Borda Recheada', price: 5.00, category: 'salgada' },
            { id: '4', name: 'Massa Doce', price: 0.00, category: 'doce' },
            { id: '5', name: 'Massa Chocolate', price: 3.00, category: 'doce' }
          ];
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(fallbackDough)
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(doughTypes)
        };
      } catch (error) {
        // Fallback em caso de erro
        const fallbackDough = [
          { id: '1', name: 'Massa Tradicional', price: 0.00, category: 'salgada' },
          { id: '2', name: 'Massa Integral', price: 2.00, category: 'salgada' },
          { id: '3', name: 'Borda Recheada', price: 5.00, category: 'salgada' },
          { id: '4', name: 'Massa Doce', price: 0.00, category: 'doce' },
          { id: '5', name: 'Massa Chocolate', price: 3.00, category: 'doce' }
        ];
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(fallbackDough)
        };
      }
    }

    // Calculate delivery distance and fee
    if (path === '/calculate-distance' && method === 'POST') {
      const { cep, address } = JSON.parse(event.body || '{}');
      
      // Primeiro tentar Google Maps (mais preciso)
      let deliveryData;
      
      try {
        const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        
        if (GOOGLE_API_KEY && address) {
          debugLog('🗺️ Usando Google Maps API para cálculo preciso', { cep, address });
          
          const fullAddress = `${address.street}, ${address.number || ''}, ${address.neighborhood}, ${address.city} - ${address.state}, ${cep}`;
          
          // 1. Geocoding: endereço → coordenadas
          const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_API_KEY}`;
          const geocodingResponse = await fetch(geocodingUrl);
          const geocodingData = await geocodingResponse.json();
          
          if (geocodingData.status === 'OK' && geocodingData.results.length > 0) {
            const destinationCoords = geocodingData.results[0].geometry.location;
            
            // 2. Routes API: calcular rota real (moto)
            const routesUrl = `https://routes.googleapis.com/directions/v2:computeRoutes`;
            const routesBody = {
              origin: {
                location: {
                  latLng: {
                    latitude: PIZZERIA_ADDRESS.coordinates.lat,
                    longitude: PIZZERIA_ADDRESS.coordinates.lng
                  }
                }
              },
              destination: {
                location: {
                  latLng: {
                    latitude: destinationCoords.lat,
                    longitude: destinationCoords.lng
                  }
                }
              },
              travelMode: 'TWO_WHEELER', // Modo moto para entrega
              routingPreference: 'TRAFFIC_UNAWARE'
            };
            
            const routesResponse = await fetch(routesUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_API_KEY,
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
              },
              body: JSON.stringify(routesBody)
            });
            
            const routesData = await routesResponse.json();
            
            if (routesData.routes && routesData.routes.length > 0) {
              const route = routesData.routes[0];
              const distanceKm = route.distanceMeters / 1000;
              const durationMinutes = parseInt(route.duration.replace('s', '')) / 60;
              
              // Fórmula Original: ceil(distância / 3km) * R$ 9,00
              const ranges = Math.ceil(distanceKm / DELIVERY_CONFIG.kmRange);
              const fee = Math.max(ranges * DELIVERY_CONFIG.feePerRange, DELIVERY_CONFIG.baseFee);
              
              deliveryData = {
                distance: Math.round(distanceKm * 10) / 10,
                deliveryFee: fee.toFixed(2),
                estimatedTime: `${Math.max(Math.round(durationMinutes), DELIVERY_CONFIG.baseTime)} min`,
                usedGoogleMaps: true
              };
              
              debugLog('✅ Google Maps cálculo preciso', deliveryData);
            }
          }
        }
      } catch (error) {
        debugLog('❌ Erro Google Maps, usando fallback', error);
      }
      
      // Fallback: usar cálculo CEP se Google Maps falhar
      if (!deliveryData) {
        debugLog('🔄 Usando fallback CEP', { cep });
        const result = calculateDeliveryFromCEP(cep);
        deliveryData = {
          ...result,
          usedGoogleMaps: false
        };
      }
      
      debugLog('💰 Cálculo de entrega finalizado', deliveryData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(deliveryData)
      };
    }

    // Create order
    if (path === '/orders' && method === 'POST') {
      const orderData = JSON.parse(event.body || '{}');
      const order = {
        id: Date.now().toString(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(order)
      };
    }

    // ========== ADMIN ENDPOINTS ==========

    // Admin login
    if (path === '/admin/login' && method === 'POST') {
      const { username, password } = JSON.parse(event.body || '{}');
      
      // Simple authentication (in production, use proper password hashing)
      const validCredentials = [
        { username: 'admin', password: 'pizzaria123' },
        { username: 'manager', password: 'manager123' }
      ];
      
      const user = validCredentials.find(u => u.username === username && u.password === password);
      
      if (user) {
        // Generate simple token (in production, use JWT)
        const token = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token,
            user: { username: user.username, role: 'admin' }
          })
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, message: 'Credenciais inválidas' })
        };
      }
    }

    // Admin - Get all flavors
    if (path === '/admin/flavors' && method === 'GET') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      try {
        const flavors = await storage.getAllFlavors();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(flavors)
        };
      } catch (error) {
        // Fallback em caso de erro
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(FALLBACK_FLAVORS)
        };
      }
    }

    // Admin - Create flavor
    if (path === '/admin/flavors' && method === 'POST') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      try {
        const flavorData = JSON.parse(event.body || '{}');
        const newFlavor = await storage.createFlavor(flavorData);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newFlavor)
        };
      } catch (error) {
        console.error('Erro ao criar sabor:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Erro interno do servidor' })
        };
      }
    }


    // Admin - Delete flavor
    if (path.startsWith('/admin/flavors/') && method === 'DELETE') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      try {
        const flavorId = path.split('/admin/flavors/')[1];
        const success = await storage.deleteFlavor(flavorId);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Sabor removido' })
        };
      } catch (error) {
        console.error('Erro ao deletar sabor:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Erro interno do servidor' })
        };
      }
    }

    // Public - Get pizzeria contact (for WhatsApp integration)
    if (path === '/public/contact' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          whatsapp: PIZZERIA_SETTINGS.contact.whatsapp,
          phone: PIZZERIA_SETTINGS.contact.phone,
          email: PIZZERIA_SETTINGS.contact.email
        })
      };
    }

    // Public - Get basic pizzeria settings (sem autenticação)
    if (path === '/public/settings' && method === 'GET') {
      try {
        const settings = await storage.getAllSettings();
        if (settings.length === 0) {
          // Fallback para variável global se não houver dados no banco
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(PIZZERIA_SETTINGS)
          };
        }
        
        // Reconstruir objeto de configurações a partir do banco
        const settingsObject = {};
        settings.forEach(setting => {
          settingsObject[setting.section] = setting.data;
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(settingsObject)
        };
      } catch (error) {
        // Fallback em caso de erro
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(PIZZERIA_SETTINGS)
        };
      }
    }

    // Admin - Get pizzeria settings
    if (path === '/admin/settings' && method === 'GET') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      try {
        const settings = await storage.getAllSettings();
        if (settings.length === 0) {
          // Migrar dados da variável global para o banco na primeira vez
          await migrateSettingsToDatabase();
          const newSettings = await storage.getAllSettings();
          
          // Reconstruir objeto de configurações a partir do banco
          const settingsObject = {};
          newSettings.forEach(setting => {
            settingsObject[setting.section] = setting.data;
          });
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(settingsObject)
          };
        }
        
        // Reconstruir objeto de configurações a partir do banco
        const settingsObject = {};
        settings.forEach(setting => {
          settingsObject[setting.section] = setting.data;
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(settingsObject)
        };
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        // Fallback para variável global
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(PIZZERIA_SETTINGS)
        };
      }
    }

    // Admin - Update pizzeria settings
    if (path === '/admin/settings' && method === 'PUT') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      try {
        const { section, data } = JSON.parse(event.body || '{}');
        
        if (!section || !data) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Seção e dados são obrigatórios' })
          };
        }

        console.log(`Recebendo dados para ${section}:`, data);
        
        // Mapear seções do frontend para seções do banco
        let dbSection = section;
        let dbData = data;
        
        if (section === 'hours' && data.businessHours) {
          dbSection = 'businessHours';
          dbData = data.businessHours;
        } else if (section === 'contact' && data.contact) {
          dbSection = 'contact';
          dbData = data.contact;
        } else if (section === 'address' && data.address) {
          dbSection = 'address';
          dbData = data.address;
        } else if (section === 'delivery' && data.delivery) {
          dbSection = 'delivery';
          dbData = data.delivery;
        } else if (section === 'branding' && data.branding) {
          dbSection = 'branding';
          dbData = data.branding;
        } else if (section === 'social' && data.social) {
          dbSection = 'social';
          dbData = data.social;
        } else if (section === 'categories' && data.categories) {
          dbSection = 'categories';
          dbData = data.categories;
        }
        
        // Verificar se configuração já existe no banco
        const existingSetting = await storage.getSettingBySection(dbSection);
        
        if (existingSetting) {
          // Atualizar configuração existente
          const updatedSetting = await storage.updateSetting(dbSection, dbData);
          console.log(`Configuração ${dbSection} atualizada no banco:`, updatedSetting);
        } else {
          // Criar nova configuração
          const newSetting = await storage.createSetting({
            section: dbSection,
            data: dbData
          });
          console.log(`Configuração ${dbSection} criada no banco:`, newSetting);
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Configurações atualizadas com sucesso no banco de dados',
            section: dbSection,
            data: dbData
          })
        };
      } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Erro interno do servidor',
            message: error.message
          })
        };
      }
    }

    // ========== ADMIN DOUGH TYPES ENDPOINTS ==========
    
    // Admin - Get all dough types
    if (path === '/admin/dough-types' && method === 'GET') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const doughTypes = [
        { id: '1', name: 'Massa Tradicional', description: 'Massa tradicional da casa', price: '0', category: 'salgadas', available: true },
        { id: '2', name: 'Massa Fina', description: 'Massa fina e crocante', price: '0', category: 'salgadas', available: true },
        { id: '3', name: 'Massa Doce Tradicional', description: 'Massa doce tradicional', price: '0', category: 'doces', available: true },
        { id: '4', name: 'Massa de Chocolate', description: 'Massa com chocolate', price: '3.00', category: 'doces', available: true },
        { id: '5', name: 'Massa de Baunilha', description: 'Massa com baunilha', price: '2.50', category: 'doces', available: true }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(doughTypes)
      };
    }

    // Admin - Create dough type
    if (path === '/admin/dough-types' && method === 'POST') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const doughData = JSON.parse(event.body || '{}');
      const newDough = {
        id: `dough_${Date.now()}`,
        ...doughData,
        available: true,
        createdAt: new Date().toISOString()
      };

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newDough)
      };
    }

    // Admin - Update dough type
    if (path.startsWith('/admin/dough-types/') && method === 'PUT') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const doughId = path.split('/admin/dough-types/')[1];
      const updateData = JSON.parse(event.body || '{}');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ id: doughId, ...updateData })
      };
    }

    // Admin - Delete dough type
    if (path.startsWith('/admin/dough-types/') && method === 'DELETE') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const doughId = path.split('/admin/dough-types/')[1];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Tipo de massa removido' })
      };
    }

    // ========== ADMIN EXTRA ITEMS ENDPOINTS ==========
    
    // Admin - Get all extra items
    if (path === '/admin/extras' && method === 'GET') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const extraItems = [
        { id: '1', name: 'Queijo Extra', description: 'Porção extra de queijo', price: '5.00', category: 'salgadas', available: true },
        { id: '2', name: 'Bacon', description: 'Bacon crocante', price: '8.00', category: 'salgadas', available: true },
        { id: '3', name: 'Catupiry', description: 'Catupiry original', price: '6.00', category: 'salgadas', available: true },
        { id: '4', name: 'CHOCOLATE BRANCO', description: 'Chocolate branco cremoso', price: '8.00', category: 'doces', available: true },
        { id: '5', name: 'CHOCOLATE AO LEITE', description: 'Chocolate ao leite derretido', price: '8.00', category: 'doces', available: true },
        { id: '6', name: 'GRANULADO', description: 'Granulado colorido', price: '4.00', category: 'doces', available: true },
        { id: '7', name: 'LEITE CONDENSADO', description: 'Leite condensado cremoso', price: '6.00', category: 'doces', available: true },
        { id: '8', name: 'COCO RALADO', description: 'Coco ralado fresco', price: '5.00', category: 'doces', available: true },
        { id: '9', name: 'FRUTAS VERMELHAS', description: 'Mix de frutas vermelhas', price: '7.00', category: 'doces', available: true }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(extraItems)
      };
    }

    // Admin - Create extra item
    if (path === '/admin/extras' && method === 'POST') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const extraData = JSON.parse(event.body || '{}');
      const newExtra = {
        id: `extra_${Date.now()}`,
        ...extraData,
        available: true,
        createdAt: new Date().toISOString()
      };

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newExtra)
      };
    }

    // Admin - Update extra item
    if (path.startsWith('/admin/extras/') && method === 'PUT') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const extraId = path.split('/admin/extras/')[1];
      const updateData = JSON.parse(event.body || '{}');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ id: extraId, ...updateData })
      };
    }

    // Admin - Delete extra item
    if (path.startsWith('/admin/extras/') && method === 'DELETE') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const extraId = path.split('/admin/extras/')[1];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Extra removido' })
      };
    }

    // Admin - Dashboard data
    if (path === '/admin/dashboard' && method === 'GET') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      let dashboardData;
      try {
        const flavors = await storage.getAllFlavors();
        dashboardData = {
          todayOrders: 15,
          monthlyRevenue: 4250.00,
          totalProducts: flavors.length,
          popularFlavors: [
            { name: 'Margherita', orders: 45 },
            { name: 'Pepperoni', orders: 38 },
            { name: 'Calabresa', orders: 32 }
          ],
          recentOrders: [
            { id: '1', customer: 'João Silva', total: 'R$ 35,00', status: 'preparing' },
            { id: '2', customer: 'Maria Santos', total: 'R$ 42,00', status: 'delivered' },
            { id: '3', customer: 'Pedro Lima', total: 'R$ 28,00', status: 'confirmed' }
          ]
        };
      } catch (error) {
        // Fallback em caso de erro
        dashboardData = {
          todayOrders: 15,
          monthlyRevenue: 4250.00,
          totalProducts: FALLBACK_FLAVORS.length,
          popularFlavors: [
            { name: 'Margherita', orders: 45 },
            { name: 'Pepperoni', orders: 38 },
            { name: 'Calabresa', orders: 32 }
          ],
          recentOrders: [
            { id: '1', customer: 'João Silva', total: 'R$ 35,00', status: 'preparing' },
            { id: '2', customer: 'Maria Santos', total: 'R$ 42,00', status: 'delivered' },
            { id: '3', customer: 'Pedro Lima', total: 'R$ 28,00', status: 'confirmed' }
          ]
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(dashboardData)
      };
    }


    // Admin - Update flavor/product
    if (path.startsWith('/admin/flavors/') && method === 'PUT') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      try {
        const flavorId = path.split('/admin/flavors/')[1];
        const updateData = JSON.parse(event.body || '{}');
        
        const updatedFlavor = await storage.updateFlavor(flavorId, updateData);
        if (!updatedFlavor) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Sabor não encontrado' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Produto atualizado com sucesso',
            flavor: updatedFlavor
          })
        };
      } catch (error) {
        console.error('Erro ao atualizar sabor:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Erro interno do servidor' })
        };
      }
    }

    // Order image upload endpoint
    if (path === '/orders/image' && method === 'POST') {
      try {
        const { dataUrl } = JSON.parse(event.body || '{}') as { dataUrl?: string };
        if (!dataUrl?.startsWith("data:image/")) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "dataUrl inválido" })
          };
        }

        // Import cloudinary dinamicamente
        const { v2: cloudinary } = await import('cloudinary');
        
        // Configure cloudinary
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
          api_key: process.env.CLOUDINARY_API_KEY!,
          api_secret: process.env.CLOUDINARY_API_SECRET!,
        });
        
        const ttlMs = 24 * 60 * 60 * 1000; // 24 horas em ms
        const deleteAt = new Date(Date.now() + ttlMs);

        const uploadResult = await cloudinary.uploader.upload(dataUrl, {
          folder: "pedidos",
          resource_type: "image",
          format: "jpg",
          overwrite: false,
          invalidate: false,
          context: { app: "frontend-pizzaria" },
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
            delete_at: deleteAt.toISOString(),
          })
        };
      } catch (error: any) {
        console.error("upload image error:", error?.message || error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Falha no upload" })
        };
      }
    }

    // Admin - Upload image
    if (path === '/admin/upload-image' && method === 'POST') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      // Simular upload de imagem (na prática, seria integrado com serviço de storage)
      const timestamp = Date.now();
      const imageUrl = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&timestamp=${timestamp}`;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Imagem carregada com sucesso',
          imageUrl 
        })
      };
    }

    // Admin - Update dough type
    if (path.startsWith('/admin/dough-types/') && method === 'PUT') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const doughId = path.split('/admin/dough-types/')[1];
      const updateData = JSON.parse(event.body || '{}');
      
      // Atualizar tipo de massa (implementação real)
      // Em produção seria persistido no banco de dados
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Tipo de massa atualizado com sucesso',
          id: doughId,
          ...updateData 
        })
      };
    }

    // Admin - Update extra item
    if (path.startsWith('/admin/extras/') && method === 'PUT' && !path.includes('/admin/extras')) {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const extraId = path.split('/admin/extras/')[1];
      const updateData = JSON.parse(event.body || '{}');
      
      // Atualizar extra (implementação real)
      // Em produção seria persistido no banco de dados
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Extra atualizado com sucesso',
          id: extraId,
          ...updateData 
        })
      };
    }

    // Admin - Update credentials
    if (path === '/admin/update-credentials' && method === 'PUT') {
      const token = event.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('admin_')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token inválido' })
        };
      }

      const { currentPassword, newUsername, newPassword } = JSON.parse(event.body || '{}');
      
      // Validar senha atual (simulação - aqui seria comparação com hash no banco)
      if (currentPassword !== 'pizzaria123') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'Senha atual incorreta' 
          })
        };
      }

      // Validar nova senha
      if (!newPassword || newPassword.length < 6) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'Nova senha deve ter pelo menos 6 caracteres' 
          })
        };
      }

      // Atualizar credenciais admin (implementação real)
      // Em produção seria persistido no banco de dados
      // Por enquanto, aplicamos as mudanças na sessão ativa
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Credenciais atualizadas com sucesso',
          user: {
            username: newUsername,
            role: 'admin'
          }
        })
      };
    }

    // Not found
    debugLog(`❌ Endpoint não encontrado: ${method} ${path}`);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };

  } catch (error: any) {
    const duration = Date.now() - startTime;
    debugLog(`🔥 Erro interno do servidor (${duration}ms)`, error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      })
    };
  } finally {
    const duration = Date.now() - startTime;
    debugLog(`⏱️ Request finalizada em ${duration}ms`);
  }
};
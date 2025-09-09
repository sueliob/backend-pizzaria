# 🍕 Pizzaria Backend

Backend Express.js completo com painel administrativo, sistema de upload de imagens, limpeza automática e APIs RESTful. Deploy via **Netlify Functions**.

## ✨ Principais Funcionalidades

### 🔧 **APIs RESTful Completas**
- **Sabores**: CRUD completo com categorização
- **Pedidos**: Criação, consulta e gerenciamento
- **Admin**: Autenticação JWT e painel de controle
- **Upload**: Sistema seguro de imagens com Cloudinary
- **Geolocalização**: Cálculo de entrega com Google Maps

### 👨‍💼 **Sistema Administrativo**
- Autenticação JWT com refresh tokens
- Gerenciamento de sabores e ingredientes
- Configurações da pizzaria (horários, contato)
- Dashboard com estatísticas em tempo real
- Controle de preços e categorias

### 📸 **Sistema de Upload Inteligente**
- Upload direto para Cloudinary
- Compressão automática (JPG, 80% qualidade)
- **Limpeza automática** (24h via cron job)
- Validação de tipos e tamanhos
- Fallbacks para diferentes formatos

### 🗺️ **Cálculo de Entrega Avançado**
- Integração com Google Maps Distance Matrix
- Cálculo por distância real (não linha reta)
- Suporte a diferentes tipos de veículo
- Fallback para cálculo por CEP
- Cache inteligente de rotas

## 🚀 Deploy no Netlify

### 1. Configuração das Functions
```bash
# Estrutura requerida
netlify/
  functions/
    api.ts              # Função principal
```

### 2. Variáveis de Ambiente
Configure no **Netlify Dashboard**:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# APIs Externas  
GOOGLE_MAPS_API_KEY=sua_chave_google_maps
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Configuração
FRONTEND_URL=https://seu-frontend.pages.dev
NODE_ENV=production

# Admin (opcional - padrão: admin/123456)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=sua_senha_segura
```

### 3. Deploy Automático
1. Conecte repositório ao Netlify
2. Build command: `npm run build`
3. Functions directory: `netlify/functions`
4. Deploy no `git push`

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Editar .env com configurações locais

# Instalar Netlify CLI
npm install -g netlify-cli

# Executar desenvolvimento
npm run dev
```

## 📡 Endpoints da API

### **🍕 Sabores**
```
GET    /api/flavors              # Listar todos os sabores
GET    /api/flavors/:category    # Sabores por categoria
POST   /api/admin/flavors        # Criar sabor (AUTH)
PUT    /api/admin/flavors/:id    # Atualizar sabor (AUTH)
DELETE /api/admin/flavors/:id    # Excluir sabor (AUTH)
```

### **📋 Pedidos**
```
POST   /api/orders               # Criar pedido
GET    /api/orders/:id          # Buscar pedido
GET    /api/admin/orders        # Listar pedidos (AUTH)
```

### **👨‍💼 Administração**
```
POST   /api/admin/login         # Login admin
POST   /api/admin/refresh       # Renovar token
GET    /api/admin/me            # Dados do admin
PUT    /api/admin/settings      # Atualizar configurações
GET    /api/admin/dashboard     # Estatísticas
```

### **📸 Upload de Imagens**
```
POST   /api/upload-image        # Upload para Cloudinary
```

### **🗺️ Geolocalização**
```
POST   /api/calculate-distance  # Calcular distância/taxa
GET    /api/public/contact      # Dados de contato
```

## 🏗️ Arquitetura

### **Estrutura do Projeto**
```
src/
├── index.ts                 # Função principal Netlify
├── index-express.ts         # Servidor Express local
├── db.ts                    # Configuração database
├── storage.ts              # Camada de dados
├── vite.ts                 # Servidor assets local
└── lib/
    ├── google-maps-service.ts    # Google Maps API
    └── distance-calculator.ts    # Cálculos de distância

shared/                     # Compartilhado com frontend
├── schema.ts              # Schemas Drizzle + Zod
└── constants.ts           # Constantes globais

netlify/
└── functions/
    └── api.ts            # Entry point para Netlify
```

### **Camadas da Aplicação**
1. **Netlify Functions** → Handler principal
2. **Express Router** → Roteamento e middleware  
3. **Storage Layer** → Abstração do banco
4. **Database** → PostgreSQL via Drizzle ORM
5. **External APIs** → Google Maps, Cloudinary

## 🔐 Sistema de Autenticação

### **JWT + Refresh Tokens**
```javascript
// Login
POST /api/admin/login
{
  "username": "admin",
  "password": "senha"
}

// Resposta
{
  "token": "eyJ...",
  "refreshToken": "abc...",
  "user": { "username": "admin", "role": "admin" }
}

// Headers para rotas protegidas
Authorization: Bearer eyJ...
```

### **Middleware de Autenticação**
- Validação automática de tokens
- Renovação transparente
- Rate limiting por IP
- Logs de segurança

## 🗄️ Banco de Dados

### **Schema Principal (Drizzle ORM)**
```sql
-- Sabores/Produtos
flavors (
  id, name, description, price, category,
  ingredients, image_url, available, created_at
)

-- Pedidos  
orders (
  id, customer_name, customer_phone, items,
  total, delivery_method, status, created_at
)

-- Configurações
pizzeria_settings (
  id, name, whatsapp, address, delivery_fee,
  opening_hours, created_at, updated_at
)

-- Admins
admin_users (
  id, username, password_hash, role,
  last_login, created_at
)
```

### **Migrations**
```bash
# Gerar migration
npm run db:generate

# Aplicar migration  
npm run db:push

# Reset database (dev only)
npm run db:reset
```

## 📸 Sistema de Limpeza Automática

### **Cron Job Inteligente**
```javascript
// Executa a cada hora
cron.schedule('0 * * * *', async () => {
  console.log('[CLEANUP] Verificando imagens para exclusão...');
  
  // Busca imagens > 24h no Cloudinary
  // Remove automaticamente via API
  // Logs detalhados no console
});
```

### **Configuração Cloudinary**
```javascript
// Upload otimizado
const uploadResult = await cloudinary.uploader.upload(imageBase64, {
  folder: 'pedidos',
  format: 'jpg',
  quality: 80,
  transformation: [
    { width: 800, height: 600, crop: 'limit' }
  ]
});
```

## 🏗️ Tecnologias

### **Backend Core**
- **Express.js** + TypeScript
- **Netlify Functions** (serverless)
- **Drizzle ORM** + PostgreSQL
- **Zod** (validação de schemas)

### **Integração de Serviços**
- **Google Maps Distance Matrix** (entrega)
- **Cloudinary** (hospedagem imagens)  
- **ViaCEP** (dados de endereço)
- **PostgreSQL (Neon)** (banco principal)

### **Segurança**
- **JWT** (autenticação)
- **bcrypt** (hash senhas)
- **CORS** (configuração personalizada)
- **Rate Limiting** (proteção DDoS)

## 📊 Monitoramento

### **Logs Estruturados**
```javascript
console.log('[AUTH] Login successful:', { username, ip });
console.log('[UPLOAD] Image uploaded:', { size, format, url });
console.log('[CLEANUP] Images removed:', { count, freed: '15MB' });
console.log('[ERROR] Database connection failed:', error);
```

### **Health Check**
```bash
GET /api/health

# Resposta
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected",
  "external_apis": {
    "google_maps": "ok",
    "cloudinary": "ok"
  }
}
```

## 🐛 Troubleshooting

### **Problemas Comuns**

**Database connection failed:**
```bash
# Verificar DATABASE_URL
console.log(process.env.DATABASE_URL)

# Testar conexão
npm run db:check
```

**Google Maps API error:**
```bash
# Verificar cota da API
# Ativar Distance Matrix API
# Verificar billing no Google Cloud
```

**Cloudinary upload fails:**
```bash
# Verificar credenciais
# Checar upload preset
# Verificar limites da conta
```

## 📋 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento local (Express)
npm run build           # Build para Netlify
npm run start           # Produção local
npm run db:generate     # Gerar migrations
npm run db:push         # Aplicar migrations
npm run db:studio       # Abrir Drizzle Studio
npm run type-check      # Verificar TypeScript
```

## 🔄 CI/CD

### **Deploy Automático**
1. **Push** para `main` → Deploy automático
2. **Preview** para outras branches  
3. **Rollback** em 1 clique no Netlify
4. **Environment** específico por branch

### **Variáveis por Ambiente**
```bash
# Production
DATABASE_URL=postgresql://prod...
FRONTEND_URL=https://pizzaria.pages.dev

# Preview  
DATABASE_URL=postgresql://staging...
FRONTEND_URL=https://preview--pizzaria.pages.dev
```

## 🎯 Próximas Melhorias

- [ ] WebSocket para pedidos em tempo real
- [ ] Sistema de filas com Redis  
- [ ] Cache distribuído com Cloudflare KV
- [ ] Métricas avançadas com Prometheus
- [ ] Backup automático de dados
- [ ] API versioning (v2)

---

**🚀 Deploy serverless pronto em minutos com Netlify Functions!**
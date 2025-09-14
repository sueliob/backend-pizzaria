# 🚀 Guia de Instalação - Cloud Deployments Independentes

## 📁 Arquitetura do Projeto
```
📁 Projeto Cloud (Produção)
├── frontend-pizzaria/ → Cloudflare Pages (React)
├── backend-pizzaria/ → Netlify Functions (Node.js)
└── Neon PostgreSQL Database
```

## 🗄️ **PASSO 1: Configurar Banco Neon PostgreSQL**

### 1.1 Criar Projeto no Neon
1. Acesse [neon.tech](https://neon.tech) e crie conta
2. **Create Project** → escolha região (preferencialmente US East)
3. Anote a **DATABASE_URL** completa
4. Formato: `postgresql://user:pass@host/dbname?sslmode=require`

### 1.2 Popular Banco com Dados
1. No **Neon Console** → **SQL Editor**
2. Execute o arquivo `production-seed.sql` completo
3. Verificar dados inseridos:
   ```sql
   SELECT COUNT(*) FROM pizza_flavors; -- deve retornar 22
   SELECT COUNT(*) FROM extras;        -- deve retornar 18
   SELECT COUNT(*) FROM admin_users;   -- deve retornar 1
   ```

## 🔧 **PASSO 2: Deploy Backend no Netlify**

### 2.1 Preparar Repositório
1. Crie repositório Git com pasta `backend-pizzaria/`
2. Confirme estrutura:
   ```
   backend-pizzaria/
   ├── netlify/functions/api.ts
   ├── shared/schema.ts
   ├── src/
   ├── package.json
   ├── netlify.toml
   └── production-seed.sql
   ```

### 2.2 Deploy no Netlify
1. Acesse [netlify.com](https://netlify.com)
2. **New site from Git** → conecte seu repositório
3. Configurações de build:
   ```bash
   Base directory: backend-pizzaria
   Build command: npm run build
   Publish directory: dist
   Functions directory: netlify/functions
   ```

### 2.3 Configurar Environment Variables
No **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

```bash
# DATABASE
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# ENVIRONMENT
NODE_ENV=production
READ_ONLY_MODE=true

# SECURITY
JWT_SECRET=sua_chave_64_caracteres_aleatorios

# CORS - Atualize com URL do Cloudflare
FRONTEND_URL=https://sua-pizzaria.pages.dev

# FLAGS
ENABLE_AUTO_SEED=false
```

### 2.4 Gerar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🌐 **PASSO 3: Deploy Frontend no Cloudflare Pages**

### 3.1 Preparar Frontend
1. Na pasta `frontend-pizzaria/`, configure API URL:
   ```typescript
   // src/lib/api-config.ts
   export const API_BASE_URL = 'https://sua-api.netlify.app/.netlify/functions/api'
   ```

### 3.2 Deploy no Cloudflare
1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages**
2. **Create a project** → **Connect to Git**
3. Configurações:
   ```bash
   Framework preset: React
   Build command: npm run build
   Build output directory: dist
   Root directory: frontend-pizzaria
   ```

### 3.3 Environment Variables (Cloudflare)
No **Pages** → **Settings** → **Environment Variables**:

```bash
# API
VITE_API_URL=https://sua-api.netlify.app/.netlify/functions/api

# ENVIRONMENT
VITE_ENV=production
```

## 🔗 **PASSO 4: Conectar os Deployments**

### 4.1 Atualizar CORS no Backend
1. No Netlify, atualize `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://sua-pizzaria.pages.dev
   ```
2. Redeploy do backend

### 4.2 Atualizar API URL no Frontend
1. No código, confirme:
   ```typescript
   // frontend-pizzaria/src/lib/api-config.ts
   export const API_BASE_URL = import.meta.env.VITE_API_URL || 
     'https://sua-api.netlify.app/.netlify/functions/api'
   ```
2. Redeploy do frontend

## 🧪 **PASSO 5: Testes de Funcionamento**

### 5.1 Testar Backend (Netlify)
```bash
# Verificar API online
GET https://sua-api.netlify.app/.netlify/functions/api
# Resposta: {"status": "Pizzaria API Online", "readOnlyMode": true}

# Testar dados
GET https://sua-api.netlify.app/.netlify/functions/api/flavors
GET https://sua-api.netlify.app/.netlify/functions/api/extras
```

### 5.2 Testar Frontend (Cloudflare)
1. Acesse: `https://sua-pizzaria.pages.dev`
2. Verificar se pizzas carregam
3. Testar carrinho e checkout
4. Confirmar admin: `admin@pizzariaexemplo.com.br` / `admin123`

### 5.3 Testar Proteção READ-ONLY
```bash
# Deve retornar erro 403
POST https://sua-api.netlify.app/.netlify/functions/api/admin/flavors
# Resposta: {"error": "Sistema em modo somente leitura"}
```

## 🔒 **PASSO 6: Configuração de Produção**

### 6.1 Domínios Personalizados
**Cloudflare Pages:**
1. **Custom domains** → adicionar seu domínio
2. Configurar DNS CNAME: `pizzaria.seudominio.com` → `sua-pizzaria.pages.dev`

**Netlify:**
1. **Domain management** → adicionar subdomínio API
2. DNS CNAME: `api.seudominio.com` → `sua-api.netlify.app`

### 6.2 Atualizar URLs Finais
```bash
# Netlify Environment Variables
FRONTEND_URL=https://pizzaria.seudominio.com

# Cloudflare Environment Variables  
VITE_API_URL=https://api.seudominio.com/.netlify/functions/api
```

## ✅ **VERIFICAÇÃO FINAL**

### Checklist de Deploy:
- [ ] ✅ Banco Neon com dados populados
- [ ] ✅ Backend Netlify funcionando
- [ ] ✅ Frontend Cloudflare carregando
- [ ] ✅ API conectada corretamente
- [ ] ✅ CORS configurado
- [ ] ✅ READ_ONLY_MODE ativo
- [ ] ✅ Admin login funcional
- [ ] ✅ WhatsApp integration OK
- [ ] ✅ Domínios personalizados (opcional)

## 🚨 **Troubleshooting**

### "Function timeout" no Netlify
- Verifique conexão DATABASE_URL
- Confirme Neon database está ativo
- Logs: Netlify Dashboard → Functions

### "Failed to fetch" no Frontend
- Confirme VITE_API_URL correto
- Verifique CORS no backend
- Teste API diretamente no navegador

### "Database connection failed"
- Neon pode estar em sleep mode
- Primeiro request pode ser lento
- Verificar firewall/SSL settings

## 📊 **Monitoramento**

### Netlify Analytics
- Functions executions
- Build deployments
- Error rates

### Cloudflare Analytics  
- Page views
- Performance metrics
- Cache hit rates

### Neon Metrics
- Connection count
- Query performance
- Storage usage

---

## 🎯 **URLs de Produção**

```bash
# Frontend (Cloudflare Pages)
https://sua-pizzaria.pages.dev
https://pizzaria.seudominio.com (custom)

# Backend API (Netlify Functions)  
https://sua-api.netlify.app/.netlify/functions/api
https://api.seudominio.com/.netlify/functions/api (custom)

# Database (Neon)
postgresql://user:pass@host/dbname?sslmode=require
```

**🍕 Deploy independente completo e funcionando!**
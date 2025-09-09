# 🚀 Deploy no Netlify Functions

## Passo a Passo

### 1. Configurar Repositório
```bash
# Fazer commit do código
git add .
git commit -m "Backend separado para Netlify Functions"
git push origin main
```

### 2. Netlify
1. Acesse https://app.netlify.com/
2. **New site from Git**
3. Conecte seu repositório GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `netlify/functions`
   - **Functions directory**: `netlify/functions`

### 3. Variáveis de Ambiente
Adicione no Netlify:
```
DATABASE_URL=sua-connection-string-neon
GOOGLE_MAPS_API_KEY=sua-chave-google-maps
FRONTEND_URL=https://seu-frontend.pages.dev
```

### 4. Deploy Automático
- Cada push no `main` = deploy automático
- Logs disponíveis no dashboard

## ✅ Pronto!
Sua API estará disponível em: `https://seu-projeto.netlify.app/.netlify/functions/api`
# Velora — Backend Shopify

Servidor proxy para conectar el dashboard de inventario con la Admin API de Shopify.

---

## Despliegue en Vercel (5 minutos)

### Paso 1 — Crea una cuenta en Vercel
Ve a https://vercel.com y regístrate gratis con tu email o con GitHub.

### Paso 2 — Sube el proyecto
1. Ve a https://vercel.com/new
2. Haz clic en **"Import Git Repository"** — o usa el método de arrastre:
   - En la pantalla de Vercel, busca la opción **"Deploy from your computer"**
   - Arrastra esta carpeta entera (`velora-backend`) al navegador

   > Si prefieres GitHub: sube esta carpeta a un repositorio nuevo en github.com e importa desde ahí.

### Paso 3 — Configura las variables de entorno
Antes de hacer clic en Deploy, Vercel te pedirá las variables de entorno.
Añade estas dos:

| Nombre | Valor |
|--------|-------|
| `SHOPIFY_SHOP` | `velora-7102238.myshopify.com` |
| `SHOPIFY_ADMIN_TOKEN` | `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` |

### Paso 4 — Despliega
Haz clic en **Deploy**. En 1-2 minutos tendrás una URL del tipo:
```
https://velora-backend-xxxx.vercel.app
```

### Paso 5 — Copia la URL
Pega esa URL aquí en el chat y actualizaré el dashboard para que use tu backend real.

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/shopify?action=products` | Lista todos los productos e inventario |
| PUT | `/api/shopify?action=variant` | Actualiza el precio de una variante |
| PUT | `/api/shopify?action=inventory` | Actualiza el stock de una variante |

---

## Estructura del proyecto

```
velora-backend/
├── api/
│   └── shopify.js   ← función serverless principal
├── vercel.json       ← configuración de Vercel
├── package.json
└── README.md
```

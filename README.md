I'll help you update the README.md based on the current codebase. The main changes needed are:

1. Update the tech stack to reflect the actual dependencies
2. Add more details about the image analysis feature
3. Update the project structure to match reality
4. Add information about environment variables

Here's the updated README.md:

```markdown:README.md
# FARO

## Visión General
FARO es una aplicación web diseñada para ayudar a las personas en Chile (y próximamente en más países de Latinoamérica) a verificar la legitimidad de mensajes recibidos a través de distintos canales de comunicación. Su principal objetivo es proteger a los usuarios, especialmente adultos mayores, contra estafas y fraudes en línea.

## ¿Por qué FARO?
En la era digital actual, las estafas a través de mensajes fraudulentos son cada vez más comunes, especialmente dirigidas a adultos mayores. FARO actúa como un faro de seguridad, iluminando el camino para identificar mensajes potencialmente peligrosos de manera simple y clara.

| Region       | Perdidas por Phishing (2023) |
|--------------|---------------------------------------|
| World    | $40 billion                          |
| United States | $16 billion                      |
| Latin America | $1.5 billion                    |
| Chile    | Approximately $150 million           |

## Características Principales

### Verificación de Mensajes
- Análisis de contenido de múltiples fuentes:
  - Mensajes de texto
  - Capturas de pantalla
  - Imágenes de conversaciones
  - Correos electrónicos

### Sistema de Alertas Simple
- Respuesta binaria fácil de entender:
  - 🟢 VERDE: Mensaje seguro
  - 🔴 ROJO: Mensaje potencialmente peligroso

### Verificaciones de Seguridad
- Análisis de URLs sospechosas
- Detección de errores tipográficos en dominios conocidos
- Verificación de protocolos de seguridad (HTTPS)
- Identificación de patrones comunes de estafa
- Análisis de imágenes con IA

## Stack Tecnológico

### Frontend
- Next.js 14+ con App Router
- React 18+
- Tailwind CSS para estilos
- ShadcnUI para componentes
- Radix UI para componentes accesibles

### Backend y Servicios
- API Routes de Next.js
- OpenAI GPT-4 Vision para análisis de imágenes
- OpenAI GPT-4 para análisis de texto

### Optimización
- Diseño responsivo para todos los dispositivos
- Optimización de imágenes con Next.js Image
- Lazy loading de componentes
- Tema claro/oscuro con next-themes

## Variables de Entorno

```bash
OPENAI_API_KEY=tu_api_key_aquí
```

## Comenzando

Para iniciar el servidor de desarrollo:

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu clave API de OpenAI

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

```
├── .env.example          # Variables de entorno (OpenAI API)
├── app/
│   ├── api/
│   │   └── check-message/
│   │       └── route.ts  # Endpoint para verificación de mensajes
│   ├── layout.tsx        # Layout principal y configuración de tema
│   ├── globals.css       # Estilos globales y variables CSS
│   └── page.tsx          # Página principal
├── components/
│   ├── image-upload.tsx      # Componente de carga de imágenes
│   ├── message-checker.tsx   # Componente principal de verificación
│   ├── mode-toggle.tsx       # Selector de tema claro/oscuro
│   ├── report-button.tsx     # Botón para reportar mensajes
│   ├── theme-provider.tsx    # Proveedor de tema
│   ├── types.ts             # Tipos TypeScript
│   ├── ui/                  # Componentes base
│   └── warning-message.tsx  # Componente de advertencias
├── lib/
│   └── utils.ts            # Utilidades compartidas
└── public/                 # Assets estáticos
```

## Estándares de Código
- Arquitectura modular y componentes reutilizables
- Tipado fuerte con TypeScript
- Comentarios claros y documentación inline
- Seguimiento de mejores prácticas de React y Next.js

## Rendimiento
- Optimización de imágenes y assets
- Lazy loading de componentes
- Caché eficiente
- Minimización de dependencias externas


## Roadmap

### Fase 1 - Actual
- ✅ Verificación de mensajes de texto
- ✅ Integración con ChatGPT
- ✅ Interfaz básica accesible
- ✅ Sistema de respuesta Verde/Rojo

### Fase 2 - Próximamente
- Soporte para mensajes de voz con transcripción automática de audio
- Expansión a más países de LATAM con soporte para variaciones lingüísticas locales
- Base de datos de bancos y servicios por país
- Patrones de estafa específicos por región

### Fase 3 - Futuro
- 📱 Aplicación móvil nativa
- Integración directa con plataformas de email
- Integración directa con WhatsApp/Telegram
- Acceso rápido desde el menú compartir
- Notificaciones en tiempo real
- Base de datos comunitaria de estafas reportadas
- Sistema de aprendizaje automático para mejorar la detección
- Panel de estadísticas para instituciones y autoridades

### Fase 4 - Visión a Largo Plazo
- 🤝 Colaboraciones Institucionales
  - Integración con sistemas bancarios
  - Alianzas con organizaciones de adultos mayores
- 🌍 Internacionalización
  - Soporte para múltiples idiomas
  - Adaptación a patrones de estafa globales
  - Interfaz culturalmente adaptada

### Ideas en Exploración
- Sistema de recompensas para usuarios que reporten estafas verificadas
- Modo familiar para que familiares puedan monitorear la actividad
- Chatbot especializado para resolver dudas sobre seguridad
- Integración con redes sociales para verificación de perfiles
- Herramienta de educación financiera básica

## Deploy

La aplicación está optimizada para ser desplegada en Vercel:

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Deploya
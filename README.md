# FARO

## Visión General
FARO es una aplicación web diseñada para ayudar a las personas en Chile (y próximamente en más países de Latinoamérica) a verificar la legitimidad de mensajes recibidos a través de distintos canales de comunicación. Su principal objetivo es proteger a los usuarios, especialmente adultos mayores, contra estafas y fraudes en línea.

## ¿Por qué FARO?
En la era digital actual, las estafas a través de mensajes fraudulentos son cada vez más comunes, especialmente dirigidas a adultos mayores. FARO actúa como un faro de seguridad, iluminando el camino para identificar mensajes potencialmente peligrosos de manera simple y clara.

## Características Principales

### Verificación de Mensajes
- Análisis de mensajes de múltiples fuentes:
  - SMS
  - WhatsApp
  - Telegram
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

## Stack Tecnológico

### Frontend
- Next.js 14+ con App Router
- React 18+
- Tailwind CSS para estilos
- ShadcnUI para componentes

### Backend y Servicios
- API de OpenAI (ChatGPT) para análisis de mensajes
- Supabase para database
- API Routes de Next.js

### Optimización
- Diseño responsivo para todos los dispositivos
- Optimización de rendimiento y tiempos de carga

## Principios de Diseño

### Interfaz de Usuario
- Diseño minimalista y limpio
- Enfoque en la accesibilidad
- Interfaz intuitiva pensada para adultos mayores
- Textos claros y legibles
- Botones y elementos interactivos de buen tamaño

### Experiencia de Usuario
- Flujo simple
- Retroalimentación clara e inmediata
- Mensajes de error comprensibles

## Comenzando

Para iniciar el servidor de desarrollo:

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves API

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

```
├── .env.example          # Variables de entorno (OpenAI API, Supabase)
├── app/
│   ├── api/
│   │   └── check-message/
│   │       └── route.ts  # Endpoint para verificación de mensajes
│   ├── favicon.ico
│   ├── globals.css       # Estilos globales y variables CSS
│   ├── layout.tsx        # Layout principal de la aplicación
│   └── page.tsx          # Página principal
├── components/
│   ├── message-checker.tsx    # Componente de verificación de mensajes
│   ├── mode-toggle.tsx        # Selector de tema claro/oscuro
│   ├── theme-provider.tsx     # Proveedor de tema
│   ├── types.ts              # Tipos TypeScript
│   ├── ui/
│   │   ├── button.tsx        # Componente de botón
│   │   ├── card.tsx          # Componente de tarjeta
│   │   └── textarea.tsx      # Componente de área de texto
│   └── warning-message.tsx   # Componente de mensajes de advertencia
├── lib/
│   └── utils.ts              # Utilidades compartidas
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
- 🔄 Soporte para mensajes de voz
  - Transcripción automática de audio
  - Análisis de contenido de mensajes de voz
  - Soporte para diferentes acentos latinoamericanos
- 🔄 Expansión a más países de LATAM
  - Base de datos de bancos y servicios por país
  - Patrones de estafa específicos por región
  - Soporte para variaciones lingüísticas locales

### Fase 3 - Futuro
- 📱 Aplicación móvil nativa
  - Integración directa con WhatsApp
  - Acceso rápido desde el menú compartir
  - Notificaciones en tiempo real
- 🎯 Características Avanzadas
  - Base de datos comunitaria de estafas reportadas
  - Sistema de aprendizaje automático para mejorar la detección
  - Panel de estadísticas para instituciones y autoridades
- 🌟 Mejoras de Accesibilidad
  - Modo de alto contraste
  - Soporte para lectores de pantalla
  - Tutoriales interactivos para adultos mayores
  - Asistente virtual por voz

### Fase 4 - Visión a Largo Plazo
- 🤝 Colaboraciones Institucionales
  - Integración con sistemas bancarios
  - Colaboración con fuerzas de seguridad
  - Alianzas con organizaciones de adultos mayores
- 🔒 Características de Seguridad Avanzada
  - Verificación biométrica
  - Autenticación de dos factores simplificada
  - Sistema de respaldo de mensajes seguros
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
- Sistema de alertas tempranas para nuevos tipos de estafa
- Comunidad de apoyo entre usuarios
- Línea directa de asistencia para casos urgentes

## Despliegue

La aplicación está optimizada para ser desplegada en Vercel:

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega

## Licencia
Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.
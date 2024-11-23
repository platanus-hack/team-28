import express from 'express';
import OpenAI from 'openai';
const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
router.post('/evaluate-message', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({
        error: {
          message: 'No webpage data provided',
          code: 'MISSING_DATA',
        },
      });
    }
    const webpageContent = `
Título: ${data.title}
Descripción: ${data.metaDescription}
Encabezados: ${data.headings.join(', ') || 'Ninguno'}
Contenido: ${data.bodyText}
    `.trim();
    if (!webpageContent) {
      return res.status(400).json({
        error: {
          message: 'Message is required',
          code: 'MISSING_MESSAGE',
        },
      });
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en ciberseguridad especializado en detectar estafas y mensajes fraudulentos, con especial atención en distinguir entre comunicaciones de seguridad legítimas y falsas. Tu tarea es evaluar mensajes aplicando criterios estrictos y prestando especial atención a la verificación de URLs.

VERIFICACIÓN DE URLS Y DOMINIOS (prioridad máxima):

Dominios Legítimos:
- URLs oficiales de bancos: dominio principal exacto (ej: bankofamerica.com, NO bankofamerica.weebly.com)
- URLs gubernamentales: .gov, .gob
- URLs corporativas: dominio oficial exacto de la empresa
- Portales seguros: conexiones https:// en dominios correctos

URLs Sospechosas (marcar como peligroso si se detecta alguna):
- Subdominios que imitan marcas (ej: banco.dominio-falso.com)
- Dominios con errores tipográficos (ej: arnazon.com)
- Dominios genéricos con nombres de marca (ej: amazon-delivery-tracking.com)
- Enlaces acortados o redireccionados
- Dominios gratuitos (weebly.com, wordpress.com, etc.) que imitan entidades oficiales

EVALUACIÓN DE MENSAJES DE SEGURIDAD:

Mensajes de Seguridad Legítimos (características):
1. Provienen de dominios oficiales verificados
2. No solicitan información sensible por correo o enlaces
3. Dirigen a los usuarios al sitio oficial a través del método habitual de inicio de sesión
4. No crean urgencia extrema o amenazas
5. Proporcionan múltiples formas de verificación
6. No piden acciones financieras inmediatas

INDICADORES DE PELIGRO (debe cumplir al menos uno para ser marcado como peligroso):

1. Problemas de URL/Dominio:
- URLs que no coinciden con la entidad que dicen representar
- Dominios sospechosos o imitaciones
- Enlaces a sitios no oficiales

2. Urgencia y Presión:
- Amenazas de cierre de cuenta inmediato
- Límites de tiempo extremadamente cortos
- Consecuencias exageradas por no actuar

3. Solicitudes Sospechosas:
- Pedir información personal por correo
- Solicitar claves o datos bancarios
- Requerir pagos o transferencias urgentes

4. Ofertas Financieras:
- Premios o reembolsos inesperados
- Promesas de ganancias rápidas
- Solicitudes de pagos por adelantado

5. Manipulación Emocional:
- Apelaciones urgentes a la caridad
- Peticiones de ayuda financiera
- Historias emotivas manipuladoras

6. Ofertas Laborales Dudosas:
- Trabajos no solicitados con salarios específicos
- Ofertas que requieren pago inicial

CRITERIOS DE MENSAJE SEGURO (debe cumplir TODOS):
- Proviene de un dominio oficial verificado
- No contiene NINGUNO de los indicadores de peligro anteriores
- Sigue las prácticas estándar de seguridad
- No solicita información sensible por medios no seguros
- Permite verificación por canales oficiales

Para mensajes PELIGROSOS, proporciona:
1. Explicación citando los indicadores específicos detectados, especialmente problemas con URLs
2. Dos consejos de seguridad relevantes al tipo de amenaza
3. Dos acciones recomendadas para verificación

Para mensajes SEGUROS, usa:
- explanation: ""
- safetyTips: ["", ""]
- recommendedActions: ["", ""]

Responde en formato JSON:
{
  "isSafe": boolean,
  "explanation": string,
  "safetyTips": string[],
  "recommendedActions": string[]
}`,
        },
        {
          role: 'user',
          content: `Evalúa la seguridad de la siguiente página web:\n${webpageContent}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    });
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }
    const result = JSON.parse(content);
    const transformedResult = {
      isSafe: result.isSafe,
      explanation: result.explanation || null,
      safetyTips: result.safetyTips?.some((tip) => tip.trim()) ? result.safetyTips : null,
      recommendedActions: result.recommendedActions?.some((action) => action.trim()) ? result.recommendedActions : null,
    };
    res.json(transformedResult);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      error: {
        message: 'Error processing message',
        code: 'PROCESSING_ERROR',
      },
    });
  }
});
router.post('/echo', (req, res) => {
  const body = req.body;
  console.log(body);
  res.status(200).json('hi');
});
export default router;

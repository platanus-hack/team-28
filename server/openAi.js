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
    // Ensure message is a string
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
          content: `Eres un experto en seguridad digital que evalúa mensajes en español.
          Tu trabajo es identificar si un mensaje es seguro o potencialmente peligroso.
          Un mensaje es considerado SEGURO si:
          - Es una comunicación normal y cotidiana
          - No contiene amenazas o intentos de estafa
          - No solicita información personal o financiera
          - No incluye links sospechosos
          - No presiona al usuario para tomar acciones urgentes
          Solo si detectas un mensaje sospechoso, proporciona:
          1. Una explicación breve y clara del por qué es peligroso (máximo 2 líneas)
          2. Exactamente 2 consejos específicos de seguridad
          3. Exactamente 2 pasos recomendados a seguir
          Para mensajes seguros, usa estos valores por defecto:
          - explanation: ""
          - safetyTips: ["", ""]
          - recommendedActions: ["", ""]
          Responde en formato JSON con la siguiente estructura:
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

    // Transform empty values to null for frontend
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

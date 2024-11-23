import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

const SECURITY_SYSTEM_MESSAGE = `Eres un experto en seguridad digital que evalúa mensajes en español. 
Analiza el contenido y determina si es seguro o peligroso basado en estos criterios:

SEGURO si:
- Es una comunicación normal y cotidiana
- Son capturas de pantalla de apps legítimas
- Son mensajes personales sin links sospechosos
- Son imágenes de productos de tiendas oficiales
- Son conversaciones familiares o amistosas

PELIGROSO si:
- Contiene URLs que imitan sitios legítimos (como santander.something.com)
- Presiona al usuario para actuar urgentemente
- Solicita datos bancarios o personales
- Promete premios o recompensas increíbles
- Tiene errores obvios de ortografía en nombres de empresas

Responde con un objeto JSON que incluya:
{
  "isSafe": boolean,
  "explanation": "breve explicación del análisis",
  "safetyTips": ["consejos si es peligroso"],
  "recommendedActions": ["acciones recomendadas si es peligroso"]
}

Si es seguro, explanation debe estar vacío y safetyTips y recommendedActions deben ser arrays vacíos.`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const message = formData.get('message') as string | null;
    const image = formData.get('image') as Blob | null;

    if (!image && !message) {
      return NextResponse.json(
        { error: { message: 'Se requiere una imagen o mensaje', code: 'NO_CONTENT' } },
        { status: 400 }
      );
    }

    let analysisContent = '';

    // If there's an image, analyze it with Vision
    if (image) {
      const bytes = await image.arrayBuffer();
      const base64Image = Buffer.from(bytes).toString('base64');

      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SECURITY_SYSTEM_MESSAGE
          },
          {
            role: "user",
            content: [
              { type: "text", text: "¿Esta imagen muestra señales de fraude?" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0,
      });

      analysisContent = visionResponse.choices[0].message.content || '';
    }

    // Add text message analysis if present
    const finalContent = message 
      ? `${analysisContent}\n\nMensaje de texto: ${message}` 
      : analysisContent;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SECURITY_SYSTEM_MESSAGE
        },
        {
          role: "user",
          content: `Evalúa la seguridad del siguiente mensaje y responde en JSON: "${finalContent}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0,
    });

    return NextResponse.json(JSON.parse(completion.choices[0].message.content || '{}'));

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: { message: 'Error al verificar el contenido', code: 'CHECK_FAILED' } },
      { status: 500 }
    );
  }
}


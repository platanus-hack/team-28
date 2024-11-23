import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

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
            content: `Eres un experto en seguridad digital que evalúa imágenes en español. 
            Un mensaje es considerado SEGURO si:
            - Es una comunicación normal y cotidiana
            - No contiene amenazas o intentos de estafa
            - No solicita información personal o financiera
            - No incluye links sospechosos
            - No presiona al usuario para tomar acciones urgentes`
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
        ]
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
          
          DEBES RESPONDER EN JSON con esta estructura exacta:
          {
            "isSafe": boolean,
            "explanation": string,
            "safetyTips": string[],
            "recommendedActions": string[]
          }`
        },
        {
          role: "user",
          content: `Evalúa la seguridad del siguiente mensaje y responde en JSON: "${finalContent}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
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


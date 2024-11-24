/**
 * Message Security Verification API
 * 
 * API endpoint that analyzes messages and images for potential security threats
 * specifically tailored for Chilean banking and common fraud patterns.
 * 
 * Features:
 * - Text message analysis for fraud indicators
 * - Image analysis using OpenAI's Vision API
 * - Bilingual response system (Spanish)
 * - Structured JSON responses with safety assessments
 * 
 * Endpoint: POST /api/check-message
 * Content-Type: multipart/form-data
 * 
 * Request Body:
 * - message?: string (optional text content)
 * - image?: Blob (optional image file)
 * 
 * Response Format:
 * {
 *   isSafe: boolean,
 *   explanation: string,
 *   safetyTips: string[],
 *   recommendedActions: string[]
 * }
 */

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

// System prompt that defines the security analysis criteria and response format
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
    // Extract message and image from form data
    const formData = await req.formData();
    const message = formData.get('message') as string | null;
    const image = formData.get('image') as Blob | null;

    // Validate that at least one content type is provided
    if (!image && !message) {
      return NextResponse.json(
        { error: { message: 'Se requiere una imagen o mensaje', code: 'NO_CONTENT' } },
        { status: 400 }
      );
    }

    let analysisContent = '';

    // Process image content if present using OpenAI's Vision API
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
        temperature: 0, // Use deterministic responses for consistency
      });

      analysisContent = visionResponse.choices[0].message.content || '';
    }

    // Combine image analysis with text message if both are present
    const finalContent = message 
      ? `${analysisContent}\n\nMensaje de texto: ${message}` 
      : analysisContent;

    // Perform final security analysis and generate structured response
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

    // Return the structured analysis results
    return NextResponse.json(JSON.parse(completion.choices[0].message.content || '{}'));

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: { message: 'Error al verificar el contenido', code: 'CHECK_FAILED' } },
      { status: 500 }
    );
  }
}


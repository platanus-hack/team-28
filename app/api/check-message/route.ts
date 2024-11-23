import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Ensure message is a string
    const sanitizedMessage = (message?.trim() || '').toString();

    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: { message: 'Message is required', code: 'MISSING_MESSAGE' } },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
          
          Responde en formato JSON con la siguiente estructura:
          {
            "isSafe": boolean,
            "explanation": string,
            "safetyTips": string[],
            "recommendedActions": string[]
          }`
        },
        {
          role: "user",
          content: `Evalúa la seguridad del siguiente mensaje: "${sanitizedMessage}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const result = JSON.parse(content) as {
      isSafe: boolean;
      explanation: string;
      safetyTips: string[];
      recommendedActions: string[];
    };
    
    // Transform empty values to null for frontend
    const transformedResult = {
      isSafe: result.isSafe,
      explanation: result.explanation || null,
      safetyTips: result.safetyTips?.some((tip: string) => tip.trim()) ? result.safetyTips : null,
      recommendedActions: result.recommendedActions?.some((action: string) => action.trim()) ? result.recommendedActions : null,
    };

    return NextResponse.json(transformedResult);

  } catch (error) {
    console.error('Error checking message:', error);
    return NextResponse.json(
      { error: { message: 'Failed to check message', code: 'CHECK_FAILED' } },
      { status: 500 }
    );
  }
}


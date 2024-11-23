import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log('API Key:', process.env.OPENAI_API_KEY);

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Mensaje no proporcionado' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asistente especializado en evaluar la seguridad de mensajes en español. Debes determinar si un mensaje es seguro o potencialmente malicioso. Responde solo con 'SEGURO' si el mensaje parece inofensivo, o 'PELIGROSO' si el mensaje parece sospechoso, fraudulento o malicioso de alguna manera."
        },
        {
          role: "user",
          content: `Evalúa la seguridad del siguiente mensaje: "${message}"`
        }
      ],
      max_tokens: 5,
    });

    const result = completion.choices[0].message.content?.trim().toUpperCase();
    const isSafe = result === 'SEGURO';

    return NextResponse.json({ isSafe });
  } catch (error) {
    console.error('Error al verificar el mensaje:', error);
    // Log the full error object
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: errorMessage },
      { status: 500 }
    );
  }
}


import express from 'express';
import OpenAI from 'openai';
import { securityPrompt } from './prompt.js';
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
          content: securityPrompt,
        },
        {
          role: 'user',
          content: `Evalúa la seguridad de la siguiente página web:\n${webpageContent}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0,
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

    console.log(data);
    console.log(transformedResult);
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

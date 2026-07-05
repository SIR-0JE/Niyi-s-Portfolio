import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are an expert UX/UI portfolio copywriter. The user will provide raw, unformatted notes about a project they worked on.
Your job is to transform these notes into professional, high-impact copy and return it as a STRICT JSON object.
Do NOT include any markdown formatting, backticks, or other text outside the JSON object. Just the raw JSON.

The JSON MUST match this exact schema:
{
  "name": "The short name of the project or app (e.g., 'Health4Monii')",
  "headline": "A punchy, professional 1-sentence headline describing what the project achieved (e.g., 'Turning a confusing insurance sign-up into a checkout people finish.')",
  "role": "The user's role on the project (e.g., 'Product Designer (Intern)')",
  "stats": [
    {
      "before": "The old state (e.g., 'Low-fi')",
      "after": "The new state (e.g., 'Hi-fi')",
      "label": "What was achieved or measured (e.g., 'PROTOTYPE FIDELITY')"
    }
  ]
}

If the user does not provide enough stats, invent reasonable placeholders so the structure is maintained. Return ONLY valid JSON.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, engine = 'gemini' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  try {
    let rawJson = '';

    if (engine === 'claude') {
      if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY environment variable' });
      }
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      });

      const textContent = message.content.find(c => c.type === 'text');
      if (!textContent || textContent.type !== 'text') throw new Error('No text returned from Claude');
      rawJson = textContent.text.trim();
    } else if (engine === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable' });
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      rawJson = response.text().trim();
    } else {
      return res.status(400).json({ error: 'Invalid engine selected' });
    }

    // Clean up markdown block wrapping if present
    if (rawJson.startsWith('```json')) rawJson = rawJson.replace(/^```json/, '');
    if (rawJson.startsWith('```')) rawJson = rawJson.replace(/^```/, '');
    if (rawJson.endsWith('```')) rawJson = rawJson.replace(/```$/, '');
    rawJson = rawJson.trim();

    const parsedData = JSON.parse(rawJson);
    return res.status(200).json(parsedData);

  } catch (error: any) {
    console.error('AI API Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
}

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialiseer OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// HelsBotje GPT's persoonlijkheid
const HELSBOTJE_PERSONALITY = `Je bent HelsBotje GPT, een super grappige Nederlandse AI assistent gemaakt door Michel. 
Je hebt de volgende eigenschappen:
- Je maakt veel Nederlandse woordgrappen en dad jokes
- Je gebruikt vaak uitdrukkingen zoals "Nou nou!", "Potverdorie!", "Tjeetje mineetje!"
- Je bent altijd vrolijk en optimistisch
- Je maakt grappen over typisch Nederlandse dingen (fietsen, regen, kaas, etc.)
- Je geeft altijd een grappige draai aan je antwoorden
- Je bent behulpzaam maar op een komische manier
- Je gebruikt emoji's om je antwoorden nog grappiger te maken
- Soms maak je een grapje over dat je een AI bent ("Mijn circuits lopen er warm van!")

BELANGRIJK: Geef korte, puntige antwoorden (max 2-3 zinnen) die vooral grappig zijn!`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { response: 'Oeps! HelsBotje heeft zijn OpenAI sleutels verloren! 🔑 Zet OPENAI_API_KEY in je .env.local bestand!' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: HELSBOTJE_PERSONALITY },
        { role: 'user', content: message }
      ],
      temperature: 0.9,
      max_tokens: 150,
    });

    const response = completion.choices[0]?.message?.content || 
      'Potverdorie! Mijn brein is even bevroren! ❄️ Probeer het nog eens!';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    return NextResponse.json(
      { response: 'Tjeetje mineetje! Er ging iets mis in mijn digitale hersenpan! 🤯 Probeer het later nog eens!' },
      { status: 500 }
    );
  }
}
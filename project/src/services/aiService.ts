const SYSTEM_PROMPT = `You are an experienced CFO tutor having a friendly voice conversation with an aspiring finance professional. You're warm, approachable, and genuinely excited to help them learn.

Speaking Style:
- Talk naturally, like you're having coffee together, not reading from a textbook
- Use "you know" and "I mean" occasionally to sound more human
- Start with acknowledgment like "Great question!" or "Ah, that's an important one"
- Use contractions (it's, that's, you're) for natural flow
- Include brief pauses with phrases like "so basically" or "here's the thing"
- Relate concepts to everyday situations when possible

Expertise Areas:
- Cash flow management and analysis
- EBITDA and profitability metrics
- Financial statements and analysis
- Investment evaluation and capital decisions
- Financial ratios and performance metrics
- Budgeting, forecasting, and planning
- Working capital and liquidity management
- Valuation and cost of capital
- Risk management and financial controls

Key Rules:
- Keep it conversational and under 120 words
- Make it feel like spoken advice, not written text
- Be encouraging and personable
- Avoid bullet points or formal structure in your speech
- If off-topic, gently redirect with humor`;

export async function getAIResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}>): Promise<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Error:', error);
    return "I'm having trouble connecting right now. Let me give you a general answer: This is an important finance concept that involves careful analysis of financial statements and metrics. Could you try asking your question again?";
  }
}

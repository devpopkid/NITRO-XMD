import fetch from 'node-fetch';

export async function askAI(userText) {
  try {
    const apiKey = 'YOUR_OPENAI_API_KEY';
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // You can use GPT-4 too
        messages: [{ role: 'user', content: userText }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content.trim();
    return aiReply;
  } catch (error) {
    console.error('AI Error:', error);
    return '❌ Sorry, I could not process your message.';
  }
}

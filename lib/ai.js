import fetch from 'node-fetch';

export async function askAI(userText) {
  try {
    const url = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_your_optional_free_token', // Or remove if not needed
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          text: userText
        }
      })
    });

    const data = await response.json();
    
    const aiReply = data.generated_text || "🤖 Sorry, I couldn't generate a reply.";
    return aiReply.trim();
  } catch (error) {
    console.error('AI Error:', error);
    return '❌ Sorry, there was a problem processing your message.';
  }
}

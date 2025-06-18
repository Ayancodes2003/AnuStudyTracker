const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { type, notes, subject, topics, book } = JSON.parse(event.body || '{}');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'Missing Gemini API key' };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  let prompt = '';
  if (type === 'summary') {
    prompt = `Summarize these notes for the subject "${subject}":\n${notes}`;
  } else if (type === 'quiz') {
    prompt = `Create a 5-question mini quiz (with answers) from these notes for the subject "${subject}":\n${notes}`;
  } else if (type === 'plan') {
    prompt = `Suggest a personalized daily study plan for the subject "${subject}" based on these notes:\n${notes}`;
  } else if (type === 'affirmation') {
    prompt = `Give a short, motivating quote or affirmation for a female student studying "${subject}".`;
  } else if (type === 'flashcards') {
    prompt = `Generate flashcards (Q&A pairs) for the subject "${subject}"${book ? ` from the book "${book}"` : ''}${topics ? ` on the topics: ${topics}` : ''}. Use these notes for context:\n${notes}\nFormat: Q: ...\nA: ...`;
  } else {
    return { statusCode: 400, body: 'Invalid type' };
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return {
      statusCode: 200,
      body: JSON.stringify({ result: text })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}; 
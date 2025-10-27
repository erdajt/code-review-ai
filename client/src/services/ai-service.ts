// AI Service Layer
export class AIService {
  async reviewCode(code: string) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: code }] }),
    });
    
    return response.json();
  }
}


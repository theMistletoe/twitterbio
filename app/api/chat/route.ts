import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { thinking } = await req.json();
  console.log(thinking);
  

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    temperature: 0.7,
    stream: true,
    messages: [
      {
        role: 'system',
        content: `あなたは提示された文章の文脈や構造を理解し、理解しやすい形に構造化・整理することが得意です。出力するのはMarkdownのプレーンテキストです。`,
      },
      {
        role: 'user',
        content: `以下の文章の文脈を汲み取り、誤字脱字と推測される部分を適切に修正した上で、人間が理解しやすい形で構造化したMarkdown形式で出力してください。出力するのはあなたが整理したMarkdownプレーンテキストのみにしてください。「${thinking}」`,
      },
      {
        role: 'user',
        content: `===以下が出力結果===`,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

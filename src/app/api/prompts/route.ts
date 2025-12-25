import { NextResponse } from 'next/server';
import { getPrompts, addPrompt } from '@/lib/db';

export async function GET() {
  const prompts = getPrompts();
  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    const newPrompt = addPrompt({ title: body.title, content: body.content });
    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}

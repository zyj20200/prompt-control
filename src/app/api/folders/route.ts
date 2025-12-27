import { NextResponse } from 'next/server';
import { getFolders, addFolder } from '@/lib/db';

export async function GET() {
  const folders = getFolders();
  return NextResponse.json(folders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    const newFolder = addFolder(body.name);
    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}

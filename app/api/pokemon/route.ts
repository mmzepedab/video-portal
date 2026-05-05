import { createPokemon } from '@/lib/server/pokemon/create-pokemon';
import { NextResponse } from 'next/server';
import z, { ZodError } from 'zod';

export async function GET() {
  return NextResponse.json({ success: 'Bien' }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pokemon = await createPokemon(body);
    console.log(`Pokemon: ${pokemon}`);

    return NextResponse.json(pokemon, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      NextResponse.json(
        {
          error: 'Validation failed',
          fieldErrors: z.flattenError(error),
        },
        { status: 400 }
      );
    }

    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error', status: 500 });
  }
}

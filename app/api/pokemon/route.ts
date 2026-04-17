import { createPokemon } from '@/lib/server/pokemon/create-pokemon';
import { createPokemonSchema } from '@/lib/shared/pokemon/schemas';
import { NextResponse } from 'next/server';
import z, { ZodError } from 'zod';

const mockedDB = [
  { name: 'Pikachu', type: 'Electric' },
  { name: 'charmander', type: 'fire' },
];

export async function GET(request: Request) {
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

import { prisma } from '@/lib/prisma';
import {
  createPokemonSchema,
  pokemonSchema,
} from '@/lib/shared/pokemon/schemas';
import { CreatePokemonInput, Pokemon } from '@/lib/shared/pokemon/types';

export async function createPokemon(
  input: CreatePokemonInput
): Promise<Pokemon> {
  const parsed = createPokemonSchema.parse(input);

  const pokemon = await prisma.pokemon.create({
    data: {
      name: parsed.name,
      type: parsed.type,
    },
  });

  return pokemonSchema.parse(pokemon);
}

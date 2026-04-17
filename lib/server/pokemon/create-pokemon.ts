import { prisma } from '@/lib/prisma';
import { POKEMON_TYPES } from '@/lib/shared/pokemon/constants';
import {
  createPokemonSchema,
  pokemonSchema,
} from '@/lib/shared/pokemon/schemas';
import { CreatePokemonInput, Pokemon } from '@/lib/shared/pokemon/types';
import z from 'zod';

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

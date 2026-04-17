import { z } from 'zod';
import { POKEMON_TYPES } from './constants';

export const createPokemonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(POKEMON_TYPES),
});

export const pokemonSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(POKEMON_TYPES),
});

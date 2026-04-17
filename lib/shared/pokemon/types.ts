import z from 'zod';
import { createPokemonSchema, pokemonSchema } from './schemas';

export type CreatePokemonInput = z.infer<typeof createPokemonSchema>;
export type Pokemon = z.infer<typeof pokemonSchema>;

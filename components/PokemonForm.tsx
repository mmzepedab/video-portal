'use client';

import { POKEMON_TYPES } from '@/lib/shared/pokemon/constants';
import {
  createPokemonSchema,
  pokemonSchema,
} from '@/lib/shared/pokemon/schemas';
import { CreatePokemonInput, Pokemon } from '@/lib/shared/pokemon/types';
import { useState } from 'react';
import z, { flattenError, ZodError } from 'zod';

export function PokemonForm() {
  const initialForm: CreatePokemonInput = { name: '', type: 'water' };

  const [form, setForm] = useState<CreatePokemonInput>(initialForm);
  const [responseData, setResponseData] = useState<Pokemon | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedInput = createPokemonSchema.safeParse(form);

    if (!parsedInput.success) {
      const { fieldErrors, formErrors } = z.flattenError(parsedInput.error);
      setErrorMessage(fieldErrors.name?.[0] || formErrors[0] || 'Invalid Form');
    }

    try {
      const response = await fetch('/api/pokemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        console.log('Server returned error:', responseJson);
        throw new Error(responseJson.message ?? 'Request failed');
      }
      /*
      const parsed = pokemonSchema.safeParse(responseJson);

      if (parsed.error instanceof ZodError) {
        console.log('Error de Zod');
        console.log(parsed.error);
      }

      if (!parsed.success) {
        throw new Error('There was an error with the response');
      }
      setResponseData(parsed.data);
      setForm(initialForm);
      */
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="pokemon-name"> Name</label>
        <input
          id="pokemon-name"
          value={form['name']}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
        <label htmlFor="pokemon-type"> Type</label>
        <select
          id="pokemon-type"
          value={form.type}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              type: e.target.value as CreatePokemonInput['type'],
            }));
          }}
        >
          {POKEMON_TYPES.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Submit Pokemon</button>

      {errorMessage && <p> {errorMessage}</p>}

      <p>Id returned from server: {responseData?.id}</p>

      <p> Pokemon name saved on server: {responseData?.name}</p>
      <p> Pokemon type saved on server: {responseData?.type}</p>
    </form>
  );
}

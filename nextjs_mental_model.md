# Next.js Mental Model

A practical guide for keeping the moving pieces straight.

---

## 1) The big picture

Think of the app as **4 layers**:

1. **UI layer**\
   What the user sees and interacts with.

2. **Client state / form layer**\
   Local state, loading state, form inputs, validation errors shown in the UI.

3. **Server/API layer**\
   Route handlers that receive requests, validate data, call services, and return JSON.

4. **Data layer**\
   Database access through Prisma.

The usual flow looks like this:

**Page / Component → form state → fetch() → route handler → Zod validation → service → Prisma → database**

Then the response comes back:

**database → Prisma → service → route handler → JSON response → client component updates UI**

---

## 2) What lives where

### `app/`

This is your **routing and screen structure**.

Use it for:

- pages
- layouts
- route handlers
- page-level organization

Examples:

- `app/page.tsx` → home page
- `app/pokemon/page.tsx` → pokemon screen
- `app/api/pokemon/route.ts` → API endpoint

### `components/`

Reusable UI pieces.

Use it for:

- forms
- cards
- buttons
- display components
- small UI building blocks

Examples:

- `components/pokemon/PokemonForm.tsx`
- `components/layout/Sidebar.tsx`
- `components/videos/VideoCard.tsx`

### `lib/`

Shared logic that is **not a page** and **not just UI**.

Use it for:

- Prisma client
- shared types
- constants
- validation schemas
- service functions
- helpers

Examples:

- `lib/prisma.ts`
- `lib/shared/pokemon/types.ts`
- `lib/shared/pokemon/schemas.ts`
- `lib/shared/pokemon/constants.ts`
- `lib/server/pokemon/createPokemon.ts`

A good mental split inside `lib/` is:

#### `lib/shared/`

Things both client and server can safely use.

Put here:

- TypeScript types
- Zod schemas
- constants
- enums / union types

#### `lib/server/`

Server-only logic.

Put here:

- database calls
- services that use Prisma
- server utilities

---

## 3) The mental model for types

Types should have a **single source of truth** whenever possible.

### Good rule

If a shape is used in multiple places, define it once in `lib/shared/...`

Examples:

- request body type
- response type
- union types like pokemon type
- reusable entity types

Example:

```ts
export const POKEMON_TYPES = ['fire', 'water'] as const;
export type PokemonType = (typeof POKEMON_TYPES)[number];

export type Pokemon = {
  id: string;
  name: string;
  type: PokemonType;
};

export type CreatePokemonInput = {
  name: string;
  type: PokemonType;
};
```

### Why this is good

- the form knows the allowed values
- the API knows the allowed values
- Prisma result can match the same type
- less duplication

### Practical rule

- **entity types** → `lib/shared/.../types.ts`
- **allowed constant arrays** → `lib/shared/.../constants.ts`
- **validation schemas** → `lib/shared/.../schemas.ts`

---

## 4) The mental model for Zod

Zod is the **runtime gatekeeper**.

TypeScript helps while coding.\
Zod helps when **real data enters the system**.

Use Zod when:

- request body enters your API
- form data needs validation
- external data must be checked

### Important idea

**TypeScript is for development. Zod is for runtime.**

You can derive types from Zod, or keep separate types if you want, but the key is:

- TypeScript catches mistakes while writing code
- Zod catches bad input while the app is running

Example:

```ts
import { z } from 'zod';

export const pokemonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['fire', 'water']),
});
```

In route handlers:

```ts
const parsed = pokemonSchema.safeParse(body);

if (!parsed.success) {
  return Response.json(
    { error: parsed.error.flatten() },
    { status: 400 }
  );
}
```

### Rule of thumb

- **Validate at the API boundary**
- do not trust the client
- client validation is nice UX, but server validation is the real protection

---

## 5) The mental model for route handlers

Route handlers are your **entry points from the frontend into the backend**.

Example:

- `app/api/pokemon/route.ts`

Think of a route handler as a small controller with 4 jobs:

1. read request
2. validate request
3. call business logic / service
4. return response

### Good route handler shape

```ts
import { createPokemon } from '@/lib/server/pokemon/createPokemon';
import { pokemonSchema } from '@/lib/shared/pokemon/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = pokemonSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const pokemon = await createPokemon(parsed.data);

    return Response.json(pokemon, { status: 201 });
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Rule of thumb

A route handler should **not** contain a lot of database logic directly.\
Instead:

- route handler handles HTTP
- service handles business logic
- Prisma handles DB

---

## 6) The mental model for service functions

Service functions are where you put the logic that the route handler should not own.

Example:

```ts
import { prisma } from '@/lib/prisma';
import { CreatePokemonInput, Pokemon } from '@/lib/shared/pokemon/types';

export async function createPokemon(
  input: CreatePokemonInput
): Promise<Pokemon> {
  const pokemon = await prisma.pokemon.create({
    data: {
      name: input.name,
      type: input.type,
    },
  });

  return pokemon;
}
```

### Why services help

- easier to test
- keeps route handlers clean
- easier to reuse later
- better separation of concerns

### Rule of thumb

If a function talks to Prisma or handles business rules, it probably belongs in `lib/server/`

---

## 7) The mental model for Prisma

Prisma is the **typed bridge** between your app and the database.

You define models in `schema.prisma`, run migrations, and Prisma generates a typed client.

Flow:

**Prisma schema → migration → generated client → use in server code**

### Important reminder

If `prisma.pokemon` does not appear:

- check that the model exists in `schema.prisma`
- run migration / generate
- restart TypeScript server or dev server if needed

### Rule of thumb

- Prisma only belongs on the **server side**
- never use Prisma directly inside client components

---

## 8) The mental model for `fetch()`

On the client, `fetch()` is how your UI talks to your API.

Example:

```ts
const response = await fetch('/api/pokemon', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
```

### Think of it like this

- `fetch()` sends data out
- route handler receives it
- route handler returns JSON
- client reads JSON and updates state

### Client responsibilities

- gather form data
- call `fetch()`
- show loading / success / error states
- update UI with returned data

### Server responsibilities

- validate
- save
- return clean response

---

## 9) Client components vs server components

This is one of the biggest moving pieces in Next.js.

### Server components

Default in the App Router.

Use them for:

- reading data on the server
- rendering content that does not need browser-only interactivity
- reducing client JS

### Client components

Use `'use client';` at the top.

Use them for:

- `useState`
- `useEffect`
- event handlers like `onClick`, `onChange`, `onSubmit`
- browser APIs

### Easy rule

If it needs interaction, it is usually a client component.

If it just displays data and does not need hooks or browser behavior, it can stay a server component.

---

## 10) A simple naming convention that stays clean

You do not need anything fancy. Keep it predictable.

### Pages and routes

- `app/pokemon/page.tsx`
- `app/api/pokemon/route.ts`

### Components

- `PokemonForm.tsx`
- `PokemonList.tsx`
- `VideoUploadForm.tsx`

Use **PascalCase** for React components.

### Shared files

- `types.ts`
- `schemas.ts`
- `constants.ts`
- `createPokemon.ts`
- `getPokemon.ts`

Use **camelCase** or descriptive function-based file names for server utilities.

### Good convention by feature

```txt
lib/
  shared/
    pokemon/
      constants.ts
      schemas.ts
      types.ts
  server/
    pokemon/
      createPokemon.ts
      getPokemon.ts
components/
  pokemon/
    PokemonForm.tsx
    PokemonList.tsx
app/
  pokemon/
    page.tsx
  api/
    pokemon/
      route.ts
```

This is easier to scale because each feature has a home.

---

## 11) How to think about request and response shapes

Always be clear about these 3 shapes:

1. **Input shape**\
   What the client sends.

2. **Stored shape**\
   What the database stores.

3. **Output shape**\
   What the API returns.

Sometimes they are the same. Often they are not.

### Example

```ts
export type CreatePokemonInput = {
  name: string;
  type: PokemonType;
};

export type Pokemon = {
  id: string;
  name: string;
  type: PokemonType;
};
```

The input has no `id`.\
The saved result does.

### Rule of thumb

Never assume request type and response type are automatically the same.

---

## 12) The full request flow in your head

When building a feature, think in this order:

### Step 1: define the shape

- constants
- union types
- entity types
- input types
- zod schema

### Step 2: define the DB model

- add model to Prisma schema
- migrate
- generate Prisma client

### Step 3: create the service

- create server function that talks to Prisma

### Step 4: create the route handler

- parse request
- validate with Zod
- call service
- return JSON

### Step 5: create the form / UI

- local state
- `fetch()` call
- show result / errors

That order avoids confusion.

---

## 13) A feature checklist you can reuse

### When creating a new feature

#### Shared

-

#### Database

-

#### Server

-

#### Client

-

---

## 14) My recommended rules for your repo

These are simple and practical.

### Rule 1

**Put shared shapes in one place**

Use:

- `lib/shared/<feature>/types.ts`
- `lib/shared/<feature>/schemas.ts`
- `lib/shared/<feature>/constants.ts`

### Rule 2

**Keep route handlers thin**

They should mostly:

- parse
- validate
- call service
- return response

### Rule 3

**Keep Prisma on the server only**

Use Prisma only in server functions or route handlers.

### Rule 4

**Validate all incoming data with Zod**

Even if the client already validates.

### Rule 5

**Organize by feature when possible**

This scales better than dumping everything into generic folders.

### Rule 6

**Name files by what they do**

Examples:

- `createPokemon.ts`
- `getPokemon.ts`
- `PokemonForm.tsx`
- `route.ts`

### Rule 7

**Use fetch from the client to talk to your own API**

Client component → `fetch('/api/...')`

---

## 15) The shortest mental model possible

When you feel lost, remember this:

### Frontend

- pages display screens
- components render UI
- client components handle interaction
- `fetch()` sends data

### Shared contract

- types define shapes
- constants define allowed values
- zod validates real input

### Backend

- route handlers receive requests
- services contain logic
- Prisma talks to the database

### Data flow

**UI → fetch → route → Zod → service → Prisma → DB**

---

## 16) Suggested repo note you can actually keep

If you want a short reference file in the repo, this is enough:

```md
# Project Rules

## Shared
- Put reusable types in `lib/shared/<feature>/types.ts`
- Put Zod schemas in `lib/shared/<feature>/schemas.ts`
- Put allowed values/constants in `lib/shared/<feature>/constants.ts`

## Server
- Put DB/business logic in `lib/server/<feature>/`
- Keep route handlers thin
- Validate request bodies with Zod before calling services
- Use Prisma only on the server

## Client
- Use client components for forms, hooks, and event handlers
- Use `fetch()` from the client to call `/api/...`
- Handle loading, success, and error states in the UI

## Naming
- Components: PascalCase
- Utility/service files: descriptive camelCase names
- API endpoints: `app/api/<feature>/route.ts`
- Pages: `app/<feature>/page.tsx`

## Main flow
UI → fetch → route handler → Zod → service → Prisma → DB
```

---

## 17) My recommendation

Yes, keeping a small `.md` file in the repo is a good idea.

Not because you will forget everything forever, but because it gives you:

- a consistent structure
- less decision fatigue
- a quick reminder when adding new features
- easier onboarding for future you

A short `PROJECT_RULES.md` or `ARCHITECTURE.md` is usually worth it.

---

## 18) My recommendation for your current setup

For the kind of practice project you are building, I would use this:

```txt
app/
  api/
    pokemon/
      route.ts
  pokemon/
    page.tsx
components/
  pokemon/
    PokemonForm.tsx
lib/
  prisma.ts
  shared/
    pokemon/
      constants.ts
      schemas.ts
      types.ts
  server/
    pokemon/
      createPokemon.ts
prisma/
  schema.prisma
```

This is simple, clean, and enough for learning without overengineering.

---

## 19) Final takeaway

You are not dealing with random moving pieces. You are mostly dealing with a pipeline:

- define shapes
- validate input
- send request
- handle route
- save to DB
- return response
- update UI

Once that pipeline feels natural, the rest of Next.js starts feeling much less messy.


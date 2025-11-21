import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => 'Hello from Elysia + Bun!')
  .listen(3000);

console.log(`Elysia is running at http://localhost:${app.server?.port}`);

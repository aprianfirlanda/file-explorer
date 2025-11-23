import { createApp } from "./app";

const app = createApp().listen(3000);

console.log(
  `Elysia is running at http://localhost:${app.server?.port}`
);

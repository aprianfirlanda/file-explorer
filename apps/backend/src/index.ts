import {Elysia} from 'elysia';
import {folderRouter} from "./modules/folder/folder.router.ts";

const app = new Elysia();

folderRouter(app);

app.listen(3000);

console.log(`Elysia is running at http://localhost:${app.server?.port}`);

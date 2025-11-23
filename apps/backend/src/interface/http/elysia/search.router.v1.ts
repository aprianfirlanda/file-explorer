import { Elysia, t } from "elysia";
import type { SearchService } from "../../../core/search/search.service";

export const createSearchRouterV1 = (searchService: SearchService) =>
  new Elysia({ prefix: "/search" }).get(
    "/",
    async ({ query }) => {
      const { q } = query;

      const result = await searchService.search({ q });
      return { data: result };
    },
    {
      query: t.Object({
        q: t.String(),
      }),
    }
  );

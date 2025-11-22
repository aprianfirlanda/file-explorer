import {Elysia, t} from 'elysia';
import {searchService} from './search.service';

export const searchRouterV1 = new Elysia({prefix: '/search'})
    .get(
      '/',
      async ({query}) => {
        const {q} = query;

        if (!q || !q.trim()) {
          return {
            data: {
              folders: [],
              files: []
            }
          };
        }

        const result = await searchService.search({
          q,
        });

        return {data: result};
      },
      {
        query: t.Object({
          q: t.String(),
        })
      }
    );

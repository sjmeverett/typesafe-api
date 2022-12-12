import { z } from 'zod';
import { createApiMethod } from './framework';

export const add = createApiMethod({
  input: z.object({
    augend: z.number(),
    addend: z.number(),
  }),
  method: async (input) => {
    return Promise.resolve({ sum: input.augend + input.addend });
  },
});

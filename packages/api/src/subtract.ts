import { z } from 'zod';
import { createApiMethod } from './framework';

export const subtract = createApiMethod({
  input: z.object({
    minuend: z.number(),
    subtrahend: z.number(),
  }),
  method: async (input) => {
    return Promise.resolve({ difference: input.minuend - input.subtrahend });
  },
});

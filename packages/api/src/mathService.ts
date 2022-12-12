import { add } from './add';
import { subtract } from './subtract';

export const mathService = {
  add,
  subtract,
};

export type MathService = typeof mathService;
export type MathServiceMethod = keyof MathService;

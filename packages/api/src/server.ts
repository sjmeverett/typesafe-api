import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { z } from 'zod';
import { callApiMethodSafe } from './framework';
import { mathService } from './mathService';

const app = new Koa();

app.use(bodyParser());

const bodySpec = z.object({
  method: z.string(),
  input: z.any(),
});

app.use(async (ctx) => {
  const body = bodySpec.parse(ctx.request.body);

  ctx.body = await callApiMethodSafe(mathService, body.method, body.input);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});

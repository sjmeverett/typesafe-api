import type {
  inferInputType,
  inferOutputType,
  MathService,
  MathServiceMethod,
} from 'api-types';
import fetch from 'node-fetch';

/**
 * Calls a given method on the math API.
 * @param method the name of the method to call
 * @param input the input to send to the method
 * @returns the result of calling the method
 */
export async function callApiMethod<Method extends MathServiceMethod>(
  method: Method,
  input: inferInputType<MathService[Method]>,
): Promise<inferOutputType<MathService[Method]>> {
  const response = await fetch('http://localhost:3000', {
    method: 'post',
    body: JSON.stringify({
      method,
      input: input as unknown,
    }),
    headers: { 'Content-type': 'application/json' },
  });

  if (response.status !== 200) {
    throw new Error(`Bad response from API: ${response.status}`);
  }

  // let's assume the API is returning what it promised...
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await response.json();
}

callApiMethod('add', { augend: 2, addend: 2 })
  .then((result) => {
    console.log(result);
  })
  .catch(console.error);

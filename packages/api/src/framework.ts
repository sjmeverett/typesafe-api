import { Schema } from 'zod';

/**
 * Represents the definition of an API method.
 */
export interface ApiMethodSpec<Input, Output> {
  input: Schema<Input>;
  method: (input: Input) => Promise<Output>;
}

/**
 * Convenience method to constrain the types in the right way.
 * @param spec the definition of the API method
 */
export function createApiMethod<Input, Output>(
  spec: ApiMethodSpec<Input, Output>,
) {
  return spec;
}

export type ApiService = {
  // the inference doesn't work properly with `unknown`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [method: string]: ApiMethodSpec<any, any>;
};

/**
 * Returns the input type for a given method spec.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type inferInputType<T> = T extends ApiMethodSpec<infer R, any>
  ? R
  : never;

/**
 * Returns the output type for a given method spec.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type inferOutputType<T> = T extends ApiMethodSpec<any, infer R>
  ? R
  : never;

/**
 * Calls the given API method if possible.
 * @param service the service the method is to be found on
 * @param method the name of the method
 * @param input the input for the method
 * @returns the result of running the method for the given input
 */
export async function callApiMethodSafe<Service extends ApiService>(
  service: Service,
  method: string,
  input: unknown,
): Promise<unknown> {
  // make sure the method is valid
  if (!(method in service)) {
    throw new Error(`Unrecognized method name ${method}`);
  }

  const spec = service[method];

  // validate the input
  const inputValidation = spec.input.safeParse(input);

  if (!inputValidation.success) {
    throw new Error('Validation failed: ' + inputValidation.error.message);
  }

  // actually call the method and return the result
  return (await spec.method(inputValidation.data)) as unknown;
}

/**
 * Calls the given API method if possible. Convenience method to make testing nicer.
 * @param service the service the method is to be found on
 * @param method the name of the method
 * @param input the input for the method
 * @returns the result of running the method for the given input
 */
export async function callApiMethod<
  Service extends ApiService,
  Method extends keyof Service,
>(
  service: Service,
  method: Method,
  input: inferInputType<Service[Method]>,
): Promise<inferOutputType<Service[Method]>> {
  return callApiMethod(service, method, input);
}

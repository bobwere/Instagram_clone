type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface InjectOptions {
  url: string;

  method?: HttpMethods;
}

/**
 * @method des
 * @description Wrapper function for showing request URL and method in the description
 * of the test suite
 */
export const des = (
  config: InjectOptions,
  action: (config: InjectOptions) => Promise<void> | void
) => {
  describe(`${config.url}  (${config.method || 'GET'})`, () => {
    action(config);
  });
};

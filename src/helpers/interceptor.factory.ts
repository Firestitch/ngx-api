export function makeInterceptorFactory(klass) {
  return function (...args) {
    return (config, data) => {
      return new klass(config, data, ...args);
    }
  };
}

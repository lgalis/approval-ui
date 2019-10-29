import asyncDebounce from '../../utilities/async-debounce';

describe('Async debounce', () => {
  const promiseMock = (shouldFail = false) => new Promise((resolve, reject) => {
    if (shouldFail) {
      return reject(false);
    }

    return resolve(true);
  });

  it('should sucesfully resolve debounced promise', (done) => {
    const debouncedPromise = asyncDebounce(promiseMock);
    return debouncedPromise().then((data) => {
      expect(data).toBe(true);
      done();
    });
  });

  it('should reject debounced promise', (done) => {
    const debouncedPromise = asyncDebounce(promiseMock);
    return debouncedPromise(true).catch((data) => {
      expect(data).toBe(false);
      done();
    });
  });
});


// Simulate API call delay and potential errors
export const simulateApiCall = <T,>(data: T, delay: number = 500, errorRate: number = 0): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Simulated API Error: Something went wrong. Please try again.'));
      } else {
        // Deep clone to prevent direct state mutation if mock data is passed
        resolve(JSON.parse(JSON.stringify(data)));
      }
    }, delay);
  });
};

// Simulate an API call that might fail to find an item
export const simulateFindApiCall = <T,>(
  findFn: () => T | undefined,
  delay: number = 300,
  errorRate: number = 0,
  notFoundMessage: string = 'Item not found.'
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Simulated API Error.'));
        return;
      }
      const item = findFn();
      if (item) {
        resolve(JSON.parse(JSON.stringify(item)));
      } else {
        reject(new Error(notFoundMessage));
      }
    }, delay);
  });
};

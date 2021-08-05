jest.mock('currency-codes/data', () => ({ filter: () => [
  {
    code: 'EUR',
    currency: 'Euro',
  },
  {
    code: 'USD',
    currency: 'US Dollar',
  },
] }));

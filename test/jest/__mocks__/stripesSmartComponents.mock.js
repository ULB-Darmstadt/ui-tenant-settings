import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  LocationLookup: () => <div>LocationLookup</div>,
  ViewMetaData: () => <div>ViewMetaData</div>,
  // ConfigManager: jest.fn(({ children }) => <div>{children}</div>),
  // ConfigManager: ({ children }) => <div>{children}</div>,
  // ConfigManager: () => <div>Config manager</div>,
// }), { virtual: true });
}));

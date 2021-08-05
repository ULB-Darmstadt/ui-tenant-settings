import React from 'react';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
    formatDisplayName: (str) => (str),

  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    FormattedTime: jest.fn(({ value, children }) => {
      if (children) {
        return children([value]);
      }

      return value;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});

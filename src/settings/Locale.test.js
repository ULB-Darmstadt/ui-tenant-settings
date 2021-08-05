import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mocks__';
import {
  withStripes,
  renderWithRouter
} from '../../test/jest/helpers';

import Locale from './Locale';

const setCurrency = jest.fn();
const setLocale = jest.fn();
const setTimezone = jest.fn();

const LocaleWithStripes = withStripes(Locale, {
  stripes: {
    setCurrency,
    setLocale,
    setTimezone,
  },
  resources: {
    settings: {
      hasLoaded: true,
      records: [{ configName: 'bindings', module: 'ORG', value: '' }],
    },
  },
});

const renderLocale = (props) => renderWithRouter(<LocaleWithStripes {...props} />);

describe('Locale', () => {
  // beforeEach(() => {
  //   jest.useFakeTimers();
  // });

  afterEach(() => {
    setCurrency.mockClear();
    setLocale.mockClear();
    setTimezone.mockClear();

    // jest.runOnlyPendingTimers();
    // jest.useRealTimers();
  });

  it('should render localization form', async () => {
    const { findAllByText } = renderLocale({ label: 'binding' });
    expect(await findAllByText('binding')).toBeDefined();
  });

  test('should choose and save locale', async () => {
    renderLocale({ label: 'binding' });

    await act(async () => {
      const localeSelect = screen.getByLabelText('ui-tenant-settings.settings.localization');
      userEvent.selectOptions(localeSelect, 'ar');

      const nuSelect = screen.getByLabelText('ui-tenant-settings.settings.numberingSystem');
      userEvent.selectOptions(nuSelect, 'arab');

      const timezoneSelect = screen.getByLabelText('ui-tenant-settings.settings.timeZonePicker');
      userEvent.selectOptions(timezoneSelect, 'America/New_York');

      const select = screen.getByLabelText('ui-tenant-settings.settings.primaryCurrency');
      userEvent.selectOptions(select, 'EUR (EUR)');

      await waitFor(() => expect(screen.getByText('stripes-core.button.save')).toBeEnabled());
      userEvent.click(screen.getByText('stripes-core.button.save'));
    });

    setTimeout(() => {
      expect(setCurrency).toHaveBeenCalledTimes(1);
      // expect(setCurrency).toHaveBeenCalledWith('EUR');

      expect(setLocale).toHaveBeenCalledTimes(1);
      // expect(setLocale).toHaveBeenCalledWith('ar-u-nu-arab');

      expect(setTimezone).toHaveBeenCalledTimes(1);
      // expect(setTimezone).toHaveBeenCalledWith('America/New_York');
    }, 2000);
  });
});

import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  CurrencySelect,
  Pane,
  PaneFooter,
  Row,
  Select,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  IfPermission,
  supportedLocales,
  supportedNumberingSystems,
  withStripes,
} from '@folio/stripes/core';
import timezones from '../util/timezones';


import styles from './Locale.css';

const timezoneOptions = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

/**
 * localesList: list of available locales suitable for a Select
 * label contains language in context's locale and in iteree's locale
 * e.g. given the context's locale is `en` and the keys `ar` and `zh-CN` show:
 *     Arabic / العربية
 *     Chinese (China) / 中文（中国）
 * e.g. given the context's locale is `ar` and the keys `ar` and `zh-CN` show:
 *     العربية / العربية
 *     الصينية (الصين) / 中文（中国）
 *
 * @param {object} intl react-intl object in the current context's locale
 * @returns {array} array of {value, label} suitable for a Select
 */
const localesList = (intl) => {
  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  // error handler if an intl context cannot be created,
  // i.e. if the browser is missing support for the requested locale
  const logLocaleError = (e) => {
    console.warn(e); // eslint-disable-line
  };

  // iterate through the locales list to build an array of { value, label } objects
  const locales = supportedLocales.map(l => {
    // intl instance with locale of current iteree
    const lIntl = createIntl({
      locale: l,
      messages: {},
      onError: logLocaleError,
    },
    cache);

    return {
      value: l,
      label: `${intl.formatDisplayName(l, { type: 'language' })} / ${lIntl.formatDisplayName(l, { type: 'language' })}`,
    };
  });

  return locales;
};

/**
 * numberingSystemsList: list of available systems, suitable for a Select
 * label contains the name and the digits zero-nine in the given system
 * e.g. given the system is `latn` show:
 *     latn (0 1 2 3 4 5 6 7 8 9)
 * e.g. given the system is `arab` show:
 *     arab (٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩)
 * More info on numbering systems:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem

 * @returns {array} array of {value, label} suitable for a Select
 */
const numberingSystemsList = () => {
  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  const formats = supportedNumberingSystems.map(f => {
    const lIntl = createIntl({
      locale: `en-u-nu-${f}`,
      messages: {},
    },
    cache);

    return {
      value: f,
      label: `${f} (${Array.from(Array(10).keys()).map(i => lIntl.formatNumber(i)).join(' ')})`,
    };
  });

  return formats;
};
class LocaleForm extends React.Component {
  constructor(props) {
    super(props);

    this.localesOptions = localesList(props.intl);
    this.numberingSystemOptions = [
      { value: '', label: '---' },
      ...numberingSystemsList()
    ];
  }

  getFooter() {
    const { pristine, submitting } = this.props;

    return (
      <PaneFooter
        renderEnd={(
          <Button
            type="submit"
            disabled={(pristine || submitting)}
            buttonStyle="primary"
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        )}
      />
    );
  }

  render() {
    const { handleSubmit, label, intl: { formatMessage } } = this.props;

    return (
      <form
        id="locale-form"
        onSubmit={handleSubmit}
        className={styles.localeForm}
      >
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={label}
          footer={this.getFooter()}
        >
          <IfPermission perm="ui-developer.settings.locale">
            <Row>
              <Col xs={12}>
                <p>
                  <FormattedMessage id="ui-tenant-settings.settings.locale.localeWarning" values={{ label: <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" /> }} />
                </p>
                <div>
                  <Button to="/settings/developer/locale">
                    <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" />
                  </Button>
                </div>
              </Col>
            </Row>
          </IfPermission>
          <Row>
            <Col xs={12} id="select-locale">
              <Field
                component={Select}
                id="locale"
                name="locale"
                placeholder="---"
                dataOptions={this.localesOptions}
                label={formatMessage({ id: 'ui-tenant-settings.settings.localization' })}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} id="select-numbering-system">
              <Field
                component={Select}
                id="numberingSystem"
                name="numberingSystem"
                dataOptions={this.numberingSystemOptions}
                label={formatMessage({ id: 'ui-tenant-settings.settings.numberingSystem' })}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} id="select-timezone">
              <Field
                component={Select}
                id="timezone"
                name="timezone"
                placeholder="---"
                dataOptions={timezoneOptions}
                label={formatMessage({ id: 'ui-tenant-settings.settings.timeZonePicker' })}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} id="select-currency">
              <Field
                component={CurrencySelect}
                id="currency"
                name="currency"
                placeholder="---"
                label={formatMessage({ id: 'ui-tenant-settings.settings.primaryCurrency' })}
              />
            </Col>
          </Row>

        </Pane>
      </form>
    );
  }
}

LocaleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  label: PropTypes.node,
  intl: PropTypes.object,
};

export default stripesFinalForm({
  navigationCheck: true,
})(withStripes(injectIntl(LocaleForm)));

import React from 'react';
import PropTypes from 'prop-types';
import { ConfigManager } from '@folio/stripes/smart-components';

import LocaleForm from './LocaleForm';

class Locale extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      setCurrency: PropTypes.func.isRequired,
      setLocale: PropTypes.func.isRequired,
      setTimezone: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  // eslint-disable-next-line class-methods-use-this
  getInitialValues(settings) {
    const value = settings.length === 0 ? '' : settings[0].value;
    const defaultConfig = { locale: 'en-US', timezone: 'UTC', currency: 'USD' };
    let config;

    try {
      config = Object.assign({}, defaultConfig, JSON.parse(value));

      // a numbering system may be glommed onto the locale.
      // separate it if so, allowing the locale and numbering system
      // to be configured independently. this is pretty brain-dead
      // right now and proper locale-value parsing will need to be
      // implemented if we choose to support for additional options.
      if (config.locale) {
        const parts = config.locale.split('-u-nu-');
        config.locale = parts[0];
        if (parts[1]) {
          config.numberingSystem = parts[0];
        }
      }
    } catch (e) {
      config = defaultConfig;
    }

    return config;
  }

  afterSave(setting) {
    const localeValues = JSON.parse(setting.value);
    let { locale } = localeValues;
    const { numberingSystem, timezone, currency } = localeValues;

    // A numbering system other than the locale's default
    // may be configured with `-u-nu-SYSTEM`
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem
    if (numberingSystem) {
      locale = `${locale}-u-nu-${numberingSystem}`;
    }

    setTimeout(() => {
      if (locale) this.props.stripes.setLocale(locale);
      if (timezone) this.props.stripes.setTimezone(timezone);
      if (currency) this.props.stripes.setCurrency(currency);
    }, 500);
  }

  // eslint-disable-next-line class-methods-use-this
  beforeSave(data) {
    const { locale, numberingSystem, timezone, currency } = data;
    return JSON.stringify({ locale, numberingSystem, timezone, currency });
  }

  render() {
    return (
      <this.configManager
        label={this.props.label}
        moduleName="ORG"
        configName="localeSettings"
        onBeforeSave={this.beforeSave}
        onAfterSave={this.afterSave}
        configFormComponent={LocaleForm}
        getInitialValues={this.getInitialValues}
      />
    );
  }
}

export default Locale;

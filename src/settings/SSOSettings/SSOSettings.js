import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesShape } from '@folio/stripes/core';
import {
  Callout,
  Layout,
} from '@folio/stripes/components';

import { patronIdentifierTypes, samlBindingTypes } from '../../constants';

import SamlForm from './SamlForm';

class SSOSettings extends React.Component {
  static manifest = Object.freeze({
    recordId: {},
    samlconfig: {
      type: 'okapi',
      path: 'saml/configuration',
      PUT: {
        path: 'saml/configuration',
      },
    },
    downloadFile: {
      accumulate: true,
      type: 'okapi',
      path: 'saml/regenerate',
    },
    urlValidator: {
      type: 'okapi',
      accumulate: 'true',
      path: 'saml/validate',
      fetch: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    stripes: stripesShape.isRequired,
    resources: PropTypes.shape({
      samlconfig: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      samlconfig: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
      downloadFile: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      urlValidator: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.updateSettings = this.updateSettings.bind(this);
  }

  getConfig() {
    const { resources } = this.props;
    const config = (resources.samlconfig || {}).records || [];
    return (config.length === 0) ? {} : config[0];
    // Note: The below causes infinite redraws if the config contains
    // child objects. Commenting out has not produced and

    //    const configData = configValue ? _.cloneDeep(configValue) : configValue;
    //    return configData;
  }

  updateSettings(settings) {
    const updateMsg = <FormattedMessage id="ui-tenant-settings.settings.updated" />;
    settings.okapiUrl = this.props.stripes.okapi.url;
    this.props.mutator.samlconfig.PUT(settings).then(() => {
      this.callout.sendCallout({ message: updateMsg });
    });
  }

  render() {
    const samlFormData = this.getConfig();

    return (
      <Layout className="full">
        <SamlForm
          label={this.props.label}
          initialValues={samlFormData}
          onSubmit={(record) => { this.updateSettings(record); }}
          optionLists={{ identifierOptions: patronIdentifierTypes, samlBindingOptions: samlBindingTypes }}
          parentMutator={this.props.mutator}
          stripes={this.props.stripes}
        />
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          hidden
          ref={(reference) => { this.downloadButton = reference; return reference; }}
        >
          <FormattedMessage id="ui-tenant-settings.settings.hiddenDownloadLink" />
        </a>
        <Callout ref={(ref) => { this.callout = ref; }} />

      </Layout>
    );
  }
}

export default SSOSettings;

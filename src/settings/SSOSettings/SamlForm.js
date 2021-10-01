import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Pane,
  Row,
  Select,
  TextField,
  PaneFooter,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';

import CreateUserOptions from './CreateUserOptions';

import styles from './SSOSettings.css';

const extensionPoints = [];
const validate = values => {
  const errors = {};

  if (!values.samlBinding) {
    errors.samlBinding = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.binding" />;
  }
  if (!values.samlAttribute) {
    errors.samlAttribute = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.fillIn" />;
  }
  if (!values.userProperty) {
    errors.userProperty = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.userProperty" />;
  }

  // Decorate with the custom validators
  Object.assign(errors, ...extensionPoints.map(f => f(values)));

  return errors;
};

class SamlForm extends React.Component {
  static propTypes = {
    validateIdpUrl: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
    values: PropTypes.object,
    optionLists: PropTypes.shape({
      identifierOptions: PropTypes.arrayOf(PropTypes.object),
      samlBindingOptions: PropTypes.arrayOf(PropTypes.object),
    }),
    parentMutator: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
      urlValidator: PropTypes.shape({
        reset: PropTypes.func.isRequired,
        GET: PropTypes.func.isRequired,
      }).isRequired,
      downloadFile: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    }),
    label: PropTypes.node,
  };

  updateMetadataInvalidated = () => {
    this.props.initialValues.metadataInvalidated = false;
    this.forceUpdate();
  }

  downloadMetadata = () => {
    this.props.parentMutator.downloadFile.reset();
    this.props.parentMutator.downloadFile.GET().then((result) => {
      const anchor = document.createElement('a');
      anchor.href = `data:text/plain;base64,${result.fileContent}`;
      anchor.download = 'sp-metadata.xml';
      anchor.click();
      this.updateMetadataInvalidated();
    });
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      initialValues,
      optionLists,
      label,
      validateIdpUrl,
      values,
    } = this.props;
    
    const identifierOptions = (optionLists.identifierOptions || []).map(i => (
      { id: i.key, label: i.label, value: i.key, selected: initialValues.userProperty === i.key }
    ));

    const samlBindingOptions = optionLists.samlBindingOptions.map(i => (
      { id: i.key, label: i.label, value: i.key, selected: initialValues.samlBinding === i.key }
    ));

    const footer = (
      <PaneFooter
        renderEnd={(
          <Button
            type="submit"
            buttonStyle="primary"
            disabled={(pristine || submitting)}
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        )}
      />
    );

    return (
      <form
        id="form-saml"
        onSubmit={handleSubmit}
        className={styles.samlForm}
      >
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={label}
          footer={footer}
        >
          <Row>
            <Col xs={12} id="fill_idpUrl">
              <Field
                label={<FormattedMessage id="ui-tenant-settings.settings.saml.idpUrl" />}
                name="idpUrl"
                id="samlconfig_idpUrl"
                component={TextField}
                required
                fullWidth
                validate={validateIdpUrl}
              />
              <div hidden={!this.props.initialValues.metadataInvalidated}>
                <FormattedMessage id="ui-tenant-settings.settings.saml.idpUrlChanged" />
              </div>
              <IfPermission perm="login-saml.all">
                <Button
                  id="download-metadata-button"
                  onClick={this.downloadMetadata}
                  disabled={!values.idpUrl || !pristine}
                >
                  <FormattedMessage id="ui-tenant-settings.settings.saml.downloadMetadata" />
                </Button>
              </IfPermission>
            </Col>
          </Row>
          <Row>
            <Col id="select_samlBinding">
              <Field
                label={<FormattedMessage id="ui-tenant-settings.settings.saml.binding" />}
                name="samlBinding"
                id="samlconfig_samlBinding"
                placeholder="---"
                component={Select}
                dataOptions={samlBindingOptions}
                fullWidth
                required
              />
            </Col>
          </Row>
          <Row>
            <Col id="fill_attribute">
              <Field
                label={<FormattedMessage id="ui-tenant-settings.settings.saml.attribute" />}
                name="samlAttribute"
                id="samlconfig_samlAttribute"
                component={TextField}
                required
                fullWidth
              />
            </Col>
          </Row>
          <Row>
            <Col id="select_userProperty">
              <Field
                label={<FormattedMessage id="ui-tenant-settings.settings.saml.userProperty" />}
                name="userProperty"
                id="samlconfig_userProperty"
                placeholder="---"
                component={Select}
                dataOptions={identifierOptions}
                fullWidth
                required
              />
            </Col>
          </Row>
          <Row>
            <Col id="saml_createuser_settings">
              <CreateUserOptions extensionPoints={extensionPoints} initialValues={this.props.initialValues} />
            </Col>
          </Row>
        </Pane>
      </form>
    );
  }
}

export default stripesFinalForm({
  validate,
  subscription: { values: true },
  navigationCheck: true,
})(SamlForm);

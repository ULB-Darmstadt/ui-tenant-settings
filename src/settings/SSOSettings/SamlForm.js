import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import {
  Button,
  Col,
  InfoPopover,
  MessageBanner,
  Pane,
  Row,
  Select,
  TextField,
  TextLink,
  PaneFooter,
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

import CreateUserOptions from './CreateUserOptions';

import styles from './SSOSettings.css';

const propTypes = {
  validateIdpUrl: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  initialValues: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
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
  stripes: PropTypes.object.isRequired,
  // values: PropTypes.object,
};

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

  return errors;
};

const SamlForm = ({
  handleSubmit,
  pristine,
  submitting,
  initialValues,
  optionLists,
  label,
  stripes,
  // values,
  validateIdpUrl,
}) => {
  const downloadMetadataUrl = `${stripes.okapi.url}/_/invoke/${stripes.okapi.tenant}/saml/metadata`;

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
        <MessageBanner className={styles.bottomMargin}>
          <p>
            <FormattedMessage id="ui-tenant-settings.settings.ssoSettings.help" />
          </p>
          <FormattedMessage id="ui-tenant-settings.settings.ssoSettings.helpUrl" />
          <br />
          <TextLink href={downloadMetadataUrl} className={styles.link} rel="noopener noreferrer" target="_blank">{downloadMetadataUrl}</TextLink>
        </MessageBanner>
        <Row>
          <Col xs={12} id="fill_idpUrl">
            <Field
              label={
                <>
                  <FormattedMessage id="ui-tenant-settings.settings.saml.metadataUrl" />
                  <InfoPopover
                    content={<FormattedMessage id="ui-tenant-settings.settings.saml.metadataUrlInfo" />}
                  />
                </>
              }
              name="idpUrl"
              id="samlconfig_idpUrl"
              component={TextField}
              required
              fullWidth
              validate={validateIdpUrl}
            />
          </Col>
        </Row>
        <Row>
          <Col id="select_samlBinding" xs={12} md={6}>
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
          <Col id="fill_attribute" xs={12} md={6}>
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
          <Col id="select_userProperty" xs={12} md={6}>
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
            <CreateUserOptions
              initialValues={initialValues}
            />
          </Col>
        </Row>
      </Pane>
    </form>
  );
};

SamlForm.propTypes = propTypes;

export default stripesFinalForm({
  validate,
  subscription: { values: true },
  navigationCheck: true,
})(SamlForm);

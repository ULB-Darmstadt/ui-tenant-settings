import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useForm } from 'react-final-form';
import {
  Button,
  Col,
  ConfirmationModal,
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
import debounce from 'lodash/debounce';

import CreateUserOptions from './CreateUserOptions';
import useIdpUrlValues from './useIdpUrlValues';

import styles from './SSOSettings.css';

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  initialValues: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
  optionLists: PropTypes.shape({
    identifierOptions: PropTypes.arrayOf(PropTypes.object),
    samlBindingOptions: PropTypes.arrayOf(PropTypes.object),
  }),
  label: PropTypes.node,
  stripes: PropTypes.object.isRequired,
  values: PropTypes.object,
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
  values,
}) => {
  const { change } = useForm();

  const { isValidationPaused, pauseValidation, resumeValidation } = useForm();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const openDeleteConfirmationModal = () => setShowDeleteConfirmationModal(true);
  const closeDeleteConfirmationModal = () => setShowDeleteConfirmationModal(false);

  const [changeMetadataConfirm, setChangeMetadataConfirm] = useState(false);

  const [metadataUrl, setMetadataUrl] = useState();
  const debounceMetadataUrl = debounce(setMetadataUrl, 800);

  useEffect(() => {
    if (!metadataUrl && initialValues.idpUrl) {
      setMetadataUrl(initialValues.idpUrl);
    }
  });

  const [valid, idps, isLoading] = useIdpUrlValues(metadataUrl);

  const [idpList, setIdpList] = useState([]);
  const [lastValidUrl, setLastValidUrl] = useState();

  useEffect(() => {
    if (valid === true) {
      if (changeMetadataConfirm === true) {
        setLastValidUrl(values.idpUrl);
      } else {
        setLastValidUrl(initialValues.idpUrl);
      }
    }
  });
  // console.log('lastValidUrl', lastValidUrl, '\n valid', valid, '\n showDeleteConfirmationModal', showDeleteConfirmationModal, '\n changeMetadataConfirm', changeMetadataConfirm);
  // console.log('metadataUrl', metadataUrl, '\n initialValues.idpUrl', initialValues.idpUrl);
  useEffect(() => {
    if (idps.length > 0 && lastValidUrl === initialValues.idpUrl && valid === true) {
      setIdpList(idps);
      // console.log('setIdpList fired INITIALLY');
    }
  }, [idps, lastValidUrl]);

  useEffect(() => {
    if (isValidationPaused && !isLoading) {
      resumeValidation();
    }
  });

  useEffect(() => {
    if (changeMetadataConfirm === true) {
      setIdpList(idps);
      // console.log('setIdpList fired, changeMetadataConfirm', changeMetadataConfirm);
    }
  });
  // service provider metadata download url
  const downloadSPMetadataUrl = `${stripes.okapi.url}/_/invoke/${stripes.okapi.tenant}/saml/metadata`;

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
          disabled={(pristine || submitting || isLoading || !valid || showDeleteConfirmationModal)}
        >
          <FormattedMessage id="stripes-core.button.save" />
        </Button>
      )}
    />
  );

  const validateMetadataUrl = (value) => {
    if (value !== initialValues.idpUrl) {
      if (valid === false) {
        return <FormattedMessage id="ui-tenant-settings.settings.saml.validate.idpUrl" />;
      } else if (valid === true && value !== lastValidUrl) {
        openDeleteConfirmationModal();
      }
    }
    return null;
  };

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
          <TextLink href={downloadSPMetadataUrl} className={styles.link} rel="noopener noreferrer" target="_blank">{downloadSPMetadataUrl}</TextLink>
        </MessageBanner>
        <Row>
          <Col xs={12} id="fill_idpUrl">
            <Field name="idpUrl" validate={validateMetadataUrl}>
              {({ input, meta }) => {
                return (<TextField
                  {...input}
                  error={meta && meta.touched && meta.error}
                  label={
                    <>
                      <FormattedMessage id="ui-tenant-settings.settings.saml.metadataUrl" />
                      <InfoPopover
                        content={<FormattedMessage id="ui-tenant-settings.settings.saml.metadataUrlInfo" />}
                      />
                    </>
                  }
                  id="samlconfig_idpUrl"
                  fullWidth
                  onChange={e => {
                    debounceMetadataUrl(e.target.value);
                    pauseValidation();
                    input.onChange(e);
                  }}
                />);
              }}
            </Field>
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
              idps={idpList}
              initialValues={initialValues}
            />
          </Col>
        </Row>
      </Pane>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={<FormattedMessage id="ui-tenant-settings.settings.saml.metadataUrl.confirmLabel" />}
        data-test-delete-confirmation-modal
        heading={<FormattedMessage id="ui-tenant-settings.settings.saml.metadataUrl.confirmHeading" />}
        id="delete-formdata-confirmation"
        message={<FormattedMessage id="ui-tenant-settings.settings.saml.metadataUrl.confirmMessage" />}
        onCancel={() => {
          setChangeMetadataConfirm(false);
          change('idpUrl', lastValidUrl);
          closeDeleteConfirmationModal();
        }}
        onConfirm={() => {
          closeDeleteConfirmationModal();
          setChangeMetadataConfirm(true);
          change('homeInstitution', null);
          change('selectedIdentityProviders', null);
        }}
        open={showDeleteConfirmationModal}
      />
    </form>
  );
};

SamlForm.propTypes = propTypes;

export default stripesFinalForm({
  validate,
  subscription: { values: true },
  navigationCheck: true,
})(SamlForm);

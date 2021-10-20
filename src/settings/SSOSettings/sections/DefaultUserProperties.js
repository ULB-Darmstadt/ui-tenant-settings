import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';
import {
  Col,
  Headline,
  Row,
  TextField,
} from '@folio/stripes/components';

const validate = value => {
  const blankString = /^\s+$/;
  if ((value && !blankString.test(value)) || value === false || value === 0) {
    return undefined;
  }
  return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
};

const CustomTextField = ({ input, label, id, required, meta }) => {
  const { values } = useFormState();

  const attr = {
    disabled: !values.userCreateMissing,
    required: (required && values.userCreateMissing)
  };
  return <TextField label={label} id={id} key={id} {...attr} {...input} {...meta} />;
};

const CustomROTextField = ({ input, label, id, required }) => {
  const { values } = useFormState();
  const { ...inputProps } = input;
  return <TextField
    id={id}
    key={id}
    required={(required && values.userCreateMissing)}
    readOnly
    disabled
    label={label}
    value={values.samlAttribute}
    {...inputProps}
  />;
};

const PropertyCollectionSet = ({ defaultUserProp, name }) => {
  return <>
    <Col key={`saml_${name}Attribute`} xs={12} md={6}>
      <Field
        label={<FormattedMessage id={`ui-tenant-settings.settings.saml.defaultUser.${name}Attribute`} />}
        name={`${defaultUserProp}.${name}Attribute`}
        id={`saml_${name}Attribute`}
        component={CustomTextField}
        fullWidth
      />
    </Col>
    <Col key={`saml_${name}Default`} xs={12} md={6}>
      <Field
        label={<FormattedMessage id={`ui-tenant-settings.settings.saml.defaultUser.${name}Default`} />}
        name={`${defaultUserProp}.${name}Default`}
        id={`saml_${name}Default`}
        component={CustomTextField}
        fullWidth
        required
        validate={validate}
      />
    </Col>
  </>;
};

const propertySets = ['firstName', 'lastName'];

const DefaultUserProperties = ({ defaultUserProp }) => {
  const { values } = useFormState();

  const currentUserProperty = values.userProperty;
  const enabled = values.userCreateMissing;
  const currentSamlProperty = values.samlAttribute;

  const usingUsername = enabled && currentUserProperty === 'username';
  const usingEmail = enabled && currentUserProperty === 'email';

  return (
    <>
      <Headline size="large" margin="small"><FormattedMessage id="ui-tenant-settings.settings.saml.userDetails" /></Headline>
      <Row tagName="fieldset">
        <Col xs={12} md={6}>
          <Field
            label={<FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.usernameAttribute" />}
            name={`${defaultUserProp}.usernameAttribute`}
            id="saml_usernameAttribute"
            component={!usingUsername ? CustomTextField : CustomROTextField}
            initialValue={usingUsername ? currentSamlProperty : undefined}
            fullWidth
          />
        </Col>
        <Col xs={12} md={6}>
          <Field
            label={<FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.emailAttribute" />}
            name={`${defaultUserProp}.emailAttribute`}
            id="saml_emailAttribute"
            component={!usingEmail ? CustomTextField : CustomROTextField}
            initialValue={usingEmail ? currentSamlProperty : undefined}
            fullWidth
          />
        </Col>
        {propertySets.map(property => <PropertyCollectionSet key={`${property}Set`} defaultUserProp={defaultUserProp} name={property} />)}
      </Row>
    </>
  );
};

DefaultUserProperties.propTypes = {
  defaultUserProp: PropTypes.string.isRequired,
};

export default DefaultUserProperties;

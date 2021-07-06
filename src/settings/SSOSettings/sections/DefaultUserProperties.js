import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';
import {
  Col,
  Row,
  TextField
} from '@folio/stripes/components';
//import stripesFinalForm from '@folio/stripes/final-form';
  
const CustomTextField = ({input, label, id, required}) => {
  const { values } = useFormState();
  return <TextField label={label} required={required} disabled={!values['userCreateMissing']} id={id} key={id} {...input} />
};

const CustomROTextField = ({input, label, id, required}) => {
  const { values } = useFormState();
  const {value, ...inputProps} = input;
  return <TextField id={id} key={id}  required={required} readOnly disabled label={label} value={values['samlAttribute']} {...inputProps} />
};

const PropertyCollectionSet = ({defaultUserProp, name}) => {
  return <Row key={`saml_${name}Row`}>
    <Col xs={12} md={6}>
      <Field
        label={<FormattedMessage id={`ui-tenant-settings.settings.saml.${name}Attribute`} />}
        name={ `${defaultUserProp}.${name}Attribute` }
        id={`saml_${name}Attribute`}
        component={CustomTextField}
        fullWidth
      />
    </Col>
    <Col xs={12} md={6}>
      <Field
        label={<FormattedMessage id={`ui-tenant-settings.settings.saml.${name}Default`} />}
        name={ `${defaultUserProp}.${name}Default` }
        id={`saml_${name}Default`}
        component={CustomTextField}
        required
        fullWidth
      />
    </Col>
  </Row>
};

const DefaultUserProperties = ({ defaultUserProp }) => {
  
  const { values } = useFormState();
  
  const currentUserProperty = values['userProperty'];
  const enabled = values['userCreateMissing'];
  const currentSamlProperty = values['samlAttribute'];
  
  const usingUsername = enabled && currentUserProperty === 'username';
  const usingEmail = enabled && currentUserProperty === 'email';
  
  const propertySets = ['firstName', 'lastName'];
  
  return <>
    <Row>
      <Col xs={12} >
        <Field
          label={<FormattedMessage id="ui-tenant-settings.settings.saml.usernameAttribute" />}
          name={ `${defaultUserProp}.usernameAttribute` }
          id="saml_usernameAttribute"
          component={ !usingUsername ? CustomTextField : CustomROTextField }
          initialValue={usingUsername ? currentSamlProperty : undefined}
          fullWidth
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12} >
        <Field
          label={<FormattedMessage id="ui-tenant-settings.settings.saml.emailAttribute" />}
          name={ `${defaultUserProp}.emailAttribute` }
          id="saml_emailAttribute"
          component={ !usingEmail ? CustomTextField : CustomROTextField }
          fullWidth
        />
      </Col>
    </Row>
    { propertySets.map(property => <PropertyCollectionSet key={`${property}Set` } defaultUserProp={defaultUserProp} name={property} />) }
  </>
};


DefaultUserProperties.propTypes = {
  initialValues: PropTypes.string.isRequired,
};

export default DefaultUserProperties;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';
import {
  Col,
  Row,
  TextField,
  Select
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

//import stripesFinalForm from '@folio/stripes/final-form';

const PARAMS_GROUPS = {
  limit: 10000,
  query: 'cql.allRecords=1 sortby group'
};

const PatronGroupSelection = ({defaultUserProp}) => {
  
  const ky = useOkapiKy();
  const { values } = useFormState();
  const attr = {
    disabled: !values['userCreateMissing'],
    required: values['userCreateMissing']
  };
  
  const { data = {} } = useQuery(
    ['patronGroups'],
    () => ky.get('groups', { searchParams: PARAMS_GROUPS }).json()
  );
  
  const options = data?.usergroups?.map(g => ({
    key: g.id,
    value: g.id,
    label: g.group.concat(g.desc ? ` (${g.desc})` : ''),
  })) ?? [];
  
  return <Field
    label={<FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.patronGroup" />}
    name={`${defaultUserProp}.patronGroup`}
    id="saml_patronGroup"
    component={Select}
    fullWidth
    dataOptions={options}
    defaultValue={values?.defaultUser?.patronGroup}
    aria-required="true"
    {...attr}
  />;
};

const CustomTextField = ({input, label, id, required}) => {
  const { values } = useFormState();
  const attr = {
    disabled: !values['userCreateMissing'],
    required: (required && values['userCreateMissing'])
  };
  return <TextField label={label} id={id} key={id} {...attr} {...input} />
};

const CustomROTextField = ({input, label, id, required}) => {
  const { values } = useFormState();
  const {value, ...inputProps} = input;
  return <TextField id={id} key={id} required={(required && values['userCreateMissing'])}
    readOnly disabled label={label} value={values['samlAttribute']} {...inputProps} />
};

const PropertyCollectionSet = ({defaultUserProp, name}) => {
  return <>
    <Col key={`saml_${name}Attribute`} xs={12} md={6}>
      <Field
        label={<FormattedMessage id={`ui-tenant-settings.settings.saml.defaultUser.${name}Attribute`} />}
        name={ `${defaultUserProp}.${name}Attribute` }
        id={`saml_${name}Attribute`}
        component={CustomTextField}
        fullWidth
      />
    </Col>
    <Col key={`saml_${name}Default`} xs={12} md={6}>
      <Field
        label={<FormattedMessage id={`ui-tenant-settings.settings.saml.defaultUser.${name}Default`} />}
        name={ `${defaultUserProp}.${name}Default` }
        id={`saml_${name}Default`}
        component={CustomTextField}
        required
        fullWidth
      />
    </Col>
  </>
};

  
const propertySets = ['firstName', 'lastName'];

const DefaultUserProperties = ({ defaultUserProp }) => {
  
  const { values } = useFormState();
  
  const currentUserProperty = values['userProperty'];
  const enabled = values['userCreateMissing'];
  const currentSamlProperty = values['samlAttribute'];
  
  const usingUsername = enabled && currentUserProperty === 'username';
  const usingEmail = enabled && currentUserProperty === 'email';
  
  return <Row tagName='fieldset' >
    <Col xs={12} tagName='legend' ><FormattedMessage id="ui-tenant-settings.settings.saml.defaultUserAttributes" /></Col>
    <Col xs={12} >
      <Field
        label={<FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.usernameAttribute" />}
        name={ `${defaultUserProp}.usernameAttribute` }
        id="saml_usernameAttribute"
        component={ !usingUsername ? CustomTextField : CustomROTextField }
        initialValue={usingUsername ? currentSamlProperty : undefined}
        fullWidth
      />
    </Col>
    <Col xs={12} >
      <Field
        label={<FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.emailAttribute" />}
        name={ `${defaultUserProp}.emailAttribute` }
        id="saml_emailAttribute"
        component={ !usingEmail ? CustomTextField : CustomROTextField }
        initialValue={ usingEmail ? currentSamlProperty : undefined }
        fullWidth
      />
    </Col>
    { propertySets.map(property => <PropertyCollectionSet key={`${property}Set` } defaultUserProp={defaultUserProp} name={property} />) }
    <Col xs={12} md={6}><PatronGroupSelection /></Col>
  </Row>
};

DefaultUserProperties.propTypes = {
  defaultUserProp: PropTypes.string.isRequired,
};

export default DefaultUserProperties;

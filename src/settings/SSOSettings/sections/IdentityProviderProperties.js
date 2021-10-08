import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';
import {
  Col,
  Headline,
  Row,
  Select,
  Selection,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

const PARAMS_GROUPS = {
  limit: 10000,
  query: 'cql.allRecords=1 sortby group'
};

const PatronGroupSelection = ({defaultIdpProp}) => {
  
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
    label: g.group.concat(g.desc ? `(${g.desc})` : ''),
  })) ?? [];
  
  return <Field
    label={<FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.patronGroup" />}
    name={`${defaultIdpProp}.patronGroup`}
    id="saml_patronGroup"
    component={Select}
    fullWidth
    dataOptions={options}
    defaultValue={values?.samlDefaultUser?.patronGroup}
    aria-required="true"
    {...attr}
  />;
};
  
const IdentityProviderProperties = ({ defaultIdpProp }) => {
  
  const ky = useOkapiKy();
  const { data: { idps = [] } = {} } = useQuery(
    ['idpValues'],
    () => ky('saml/configuration/idps-all').json()
  );

  const { values } = useFormState();
  
  const dataOptions = idps?.map(idp => ({
      value: idp.id,
      label: idp.displayName,
    })) || [];

  const filterOptions = (filterString, options) => (options.filter(o => new RegExp(filterString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(o.label)));
  
  return (
  <>
   <Headline size="large" margin="small"><FormattedMessage id="ui-tenant-settings.settings.saml.identityProviders" /></Headline>        
   <Row tagName='fieldset' >
    <Col xs={12} md={6} >
      <Field
        component={Selection}
        dataOptions={dataOptions}
        disabled={!values['userCreateMissing']}
        label={<FormattedMessage id="ui-tenant-settings.settings.saml.idp.homeInstitution" />}
        name={`${defaultIdpProp}.homeInstitution.id`}
        id="saml_homeInstitution"
        onFilter={filterOptions}
        fullWidth
      />
    </Col>   
    <Col xs={12} md={6}><PatronGroupSelection defaultIdpProp={defaultIdpProp} /></Col>
   </Row>
  </>
  );
};

IdentityProviderProperties.propTypes = {
  defaultIdpProp: PropTypes.string.isRequired,
};

export default IdentityProviderProperties;

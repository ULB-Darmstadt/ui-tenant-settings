import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field, useFormState } from 'react-final-form';
import {
  Button,
  Col,
  Headline,
  RepeatableField,
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

const PatronGroupSelection = ({defaultIdpProp, label, index}) => {
  
  const ky = useOkapiKy();
  const { values } = useFormState();
  
  const [defaultPatronGroup, setDefaultPatronGroup] = useState();
  const [patronGroupRequired, setPatronGroupRequired] = useState();
  
  useEffect(() => {
    // in the selectedIdentityProviders array, fill the patronGroup field with the last selected value
    if (defaultIdpProp != 'homeInstitution' && index>0) {
      setDefaultPatronGroup(values.selectedIdentityProviders[index-1].patronGroup);
    }
  });

  useEffect(() => {
    // patron group is a required field if identity provider field is filled
    if ( (defaultIdpProp == 'homeInstitution' && values?.[defaultIdpProp]?.id) || (defaultIdpProp != 'homeInstitution' && values?.selectedIdentityProviders[index]?.id)) {
      setPatronGroupRequired(true);
    } else {
      setPatronGroupRequired(false);
    }
  });
  
  const attr = {
    disabled: !values['userCreateMissing'],
    required: (values['userCreateMissing'] && patronGroupRequired),
    label: label ? <FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.patronGroup" /> : undefined
  };
  
  const { data = {} } = useQuery(
    ['patronGroups'],
    () => ky.get('groups', { searchParams: PARAMS_GROUPS }).json()
    );
  
  const emptyOption = [{
    key: '1',
    value: null,
    label: ''
  }];

  const options = data?.usergroups?.map(g => ({
    key: g.id,
    value: g.id,
    label: g.group.concat(g.desc ? `(${g.desc})` : ''),
  })) ?? [];

  const dataOptions = [...emptyOption, ...options];
  
  return <Field 
    name={`${defaultIdpProp}.patronGroup`}
    id="saml_patronGroup"
    component={Select}
    fullWidth
    dataOptions={dataOptions}
    defaultValue={defaultPatronGroup}
    aria-required="true"
    {...attr}
  />;
};
  
const renderHeadline = () => {
  return (
    <Headline size="medium">
      <Row>
        <Col md xs={12}><FormattedMessage id="ui-tenant-settings.settings.saml.idp.provider" /></Col>
        <Col md xs={12}><FormattedMessage id="ui-tenant-settings.settings.saml.defaultUser.patronGroup" /></Col>
      </Row>
    </Headline>
  );
}
const IdentityProviderProperties = () => {
  
  const { values } = useFormState();
  const ky = useOkapiKy();
  
  const { data: { idps = [] } = {} } = useQuery(
    ['idpValues'],
    () => ky('saml/configuration/idps-all').json()
    );

  const dataOptions = idps?.map(idp => ({
      value: idp.id,
      label: idp.displayName,
    })) || [];

  const filterOptions = (filterString, options) => (options.filter(o => new RegExp(filterString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(o.label)));
  
  return (
  <>
   <Headline size="large" margin="small"><FormattedMessage id="ui-tenant-settings.settings.saml.identityProviders" /></Headline>        
   <Row tagName='fieldset' >
    <Col md xs={12}>
      <Field
        component={Selection}
        dataOptions={dataOptions}
        disabled={!values['userCreateMissing']}
        label={<FormattedMessage id="ui-tenant-settings.settings.saml.idp.homeInstitution" />}
        name="homeInstitution.id"
        id="saml_homeInstitution"
        onFilter={filterOptions}
        fullWidth
      />
    </Col>   
    <Col md xs={12}><PatronGroupSelection defaultIdpProp='homeInstitution' label /></Col>
   </Row>
   { source?.length > 1 ?
     <FieldArray
      addLabel={<FormattedMessage id="ui-tenant-settings.settings.saml.idp.addIdentityProvider" />}
      component={RepeatableField}
      name="selectedIdentityProviders"
      onAdd={fields => fields.push('')}
      // onRemove={(fields, index) => fields.remove(index)}
      // fields: selectedIdentityProviders[index] (= $name[$index])
      renderField={(_fields, index) => (
      <>
      {index == 0 ? renderHeadline() : null}
      <Row>
       <Col md xs={12}>
       <FormattedMessage id="ui-tenant-settings.settings.saml.idp.placeholderText">
         {placeholder => (
         <Field
         component={Selection}
         dataOptions={dataOptions}
         disabled={!values['userCreateMissing']}
         // name={`${fields}.id`}
         name={`selectedIdentityProviders[${index}].id`}
         id={`saml_selectedIdentityProviders[${index}].id`}
         onFilter={filterOptions}
         placeholder={placeholder}
         fullWidth
        />
        )}
      </FormattedMessage>
       </Col>   
       <Col md xs={12}><PatronGroupSelection defaultIdpProp={`selectedIdentityProviders[${index}]`} index={index}/></Col>
      </Row>
      </>
      )}
    />
    :
    <Button disabled>
     <FormattedMessage id="ui-tenant-settings.settings.saml.idp.addIdentityProvider" /> 
    </Button>
   }
  </>
  );
};

export default IdentityProviderProperties;

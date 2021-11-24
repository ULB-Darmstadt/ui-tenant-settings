import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field, useFormState } from 'react-final-form';
import { uniqueId } from 'lodash';
import {
  Button,
  Col,
  Headline,
  IconButton,
  Row,
  Select,
  Selection,
  Tooltip
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

const validateObject = (formValue = {}) => {
  // validate={(values['userCreateMissing'] && values.idpUrl !== undefined) ? validateObject : undefined}
  const { ...value } = formValue;
  if (Object.keys(value).length === 0) {
    return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
  }
  return undefined;
};

const PARAMS_GROUPS = {
  limit: 10000,
  query: 'cql.allRecords=1 sortby group'
};

const PatronGroupSelection = ({ defaultIdpProp, label, index }) => {

  const ky = useOkapiKy();
  const { values } = useFormState();

  const [defaultPatronGroup, setDefaultPatronGroup] = useState();
  const [patronGroupRequired, setPatronGroupRequired] = useState();

  useEffect(() => {
    // patron group is a required field if identity provider field is filled
    if ((defaultIdpProp === 'homeInstitution' && values?.homeInstitution?.id) || (defaultIdpProp !== 'homeInstitution' && values?.selectedIdentityProviders[index]?.id)) {
      setPatronGroupRequired(true);
    } else {
      setPatronGroupRequired(false);
    }

    // in the selectedIdentityProviders array, fill the patronGroup field with the last selected value
    if (defaultIdpProp != 'homeInstitution' && index > 0) {
      setDefaultPatronGroup(values.selectedIdentityProviders[index - 1]?.patronGroup);
    }
  });


  const attr = {
    disabled: !values['userCreateMissing'],
    required: (values['userCreateMissing'] && patronGroupRequired),
    label: label ? <FormattedMessage id="ui-tenant-settings.settings.saml.idp.homeInstitutionPatronGroup" /> : undefined
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
    initialValue={defaultPatronGroup}
    component={Select}
    fullWidth
    dataOptions={dataOptions}
    aria-required="true"
    validate={validateObject}
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
};

const IdentityProviderProperties = ({ idps }) => {

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
        <Col md xs={12}>
          <Field
            component={Selection}
            dataOptions={dataOptions}
            disabled={!values['userCreateMissing']}
            label={<FormattedMessage id="ui-tenant-settings.settings.saml.idp.homeInstitution" />}
            name="homeInstitution.id"
            id="saml_homeInstitution"
            onFilter={filterOptions}
            validate={validateObject}
            required={values.idpUrl !== undefined}
            fullWidth
          />
        </Col>
        <Col md xs={12}><PatronGroupSelection defaultIdpProp='homeInstitution' label /></Col>
      </Row>
      {idps?.length > 1 ?
        <FieldArray name="selectedIdentityProviders">
          {({ fields }) => (
            <div>
              {fields.map((name, index) => (
                <div key={name}>
                  <>
                    {index == 0 ? renderHeadline() : null}
                    <Row>
                      <Col md={6} xs={12}>
                        <FormattedMessage id="ui-tenant-settings.settings.saml.idp.placeholderText">
                          {placeholder => (
                            <Field
                              component={Selection}
                              dataOptions={dataOptions}
                              disabled={!values['userCreateMissing']}
                              name={`selectedIdentityProviders[${index}].id`}
                              id={`saml_selectedIdentityProviders[${index}].id`}
                              onFilter={filterOptions}
                              placeholder={placeholder[0]}
                              fullWidth
                              required
                              validate={validateObject}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col md={5} xs={12}><PatronGroupSelection defaultIdpProp={`selectedIdentityProviders[${index}]`} index={index} /></Col>
                      <Col md={1} xs={12}>
                        <IconButton
                          icon="trash"
                          onClick={() => fields.remove(index)}
                        />
                      </Col>
                    </Row>
                  </>
                </div>
              ))}
              <Button
                disabled={!values['userCreateMissing']}
                id='identity-provider-add-button'
                onClick={() => fields.push()}
              >
                <FormattedMessage id="ui-tenant-settings.settings.saml.idp.addIdentityProvider" />
              </Button>
            </div>
          )}
        </FieldArray>
        :
        <Tooltip
          id={uniqueId('addIdentityProvider')}
          text={<FormattedMessage id="ui-tenant-settings.settings.saml.idp.addIdentityProvider.tooltip" />}
        >
          {({ ref, ariaIds }) => (
            <div
              ref={ref}
              aria-labelledby={ariaIds.text}
            >
              <Button
                disabled
                id='identity-provider-add-button'
              >
                <FormattedMessage id="ui-tenant-settings.settings.saml.idp.addIdentityProvider" />
              </Button>
            </div>
          )}
        </Tooltip>
      }
    </>
  );
};

IdentityProviderProperties.propTypes = {
  idps: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default IdentityProviderProperties;

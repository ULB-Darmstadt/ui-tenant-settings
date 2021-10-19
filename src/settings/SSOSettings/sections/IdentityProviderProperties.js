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

const PatronGroupSelection = ({ defaultIdpProp, label, index }) => {

  const ky = useOkapiKy();
  const { values } = useFormState();

  const [defaultPatronGroup, setDefaultPatronGroup] = useState();
  const [patronGroupRequired, setPatronGroupRequired] = useState();

  useEffect(() => {
    // in the selectedIdentityProviders array, fill the patronGroup field with the last selected value
    if (defaultIdpProp != 'homeInstitution' && index > 0) {
      setDefaultPatronGroup(values.selectedIdentityProviders[index - 1].patronGroup);
    }
  });

  useEffect(() => {
    // patron group is a required field if identity provider field is filled
    if ((defaultIdpProp == 'homeInstitution' && values?.[defaultIdpProp]?.id) || (defaultIdpProp != 'homeInstitution' && values?.selectedIdentityProviders[index]?.id)) {
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

  const idpHome = [
    {
      "id": "https://idp-dev.hrz.tu-darmstadt.de/idp/shibboleth",
      "displayName": "Technical University of Darmstadt (development)",
      "description": "Identity Provider of TU Darmstadt (Development)",
      "i18n": {
        "de": {
          "displayName": "Technische Universität Darmstadt (development)",
          "description": "Identity Provider der TU Darmstadt (Development)"
        },
        "en": {
          "displayName": "Technical University of Darmstadt (development)",
          "description": "Identity Provider of TU Darmstadt (Development)"
        }
      }
    }];

  const idpList = [
    {
      "id": "https://aai-integration.dfn.de/idp/shibboleth",
      "displayName": "DFN-AAI Integration + Test IdP",
      "description": "AAI Integration and Test IdP operated by DFN-AAI",
      "i18n": {
        "de": {
          "displayName": "DFN-AAI Integration + Test IdP",
          "description": "AAI Integration and Test IdP operated by DFN-AAI"
        },
        "en": {
          "displayName": "DFN-AAI Integration + Test IdP",
          "description": "AAI Integration and Test IdP operated by DFN-AAI"
        }
      }
    },
    {
      "id": "https://aai-mdc2.mdc-berlin.de/idp/shibboleth",
      "displayName": "Max Delbrück Center for Molecular Medicine (Test IdP)",
      "description": "Test IdP of MDC Berlin",
      "i18n": {
        "de": {
          "displayName": "Max-Delbrück-Centrum für molekulare Medizin (Test IdP)",
          "description": "Test IdP des MDC Berlin"
        },
        "en": {
          "displayName": "Max Delbrück Center for Molecular Medicine (Test IdP)",
          "description": "Test IdP of MDC Berlin"
        }
      }
    },
    {
      "id": "https://aai-test-v3.ruhr-uni-bochum.de/idp/shibboleth",
      "displayName": "Ruhr-Universitaet Bochum TEST-IDP-v3",
      "description": "Ruhr-Universitaet Bochum Test-IdP for Shibboleth v3 migration",
      "i18n": {
        "de": {
          "displayName": "Ruhr-Universität Bochum TEST-IDP-v3",
          "description": "Test-IdP der Ruhr-Universität Bochum für die Shibboleth v3 Migration"
        },
        "en": {
          "displayName": "Ruhr-Universitaet Bochum TEST-IDP-v3",
          "description": "Ruhr-Universitaet Bochum Test-IdP for Shibboleth v3 migration"
        }
      }
    },
    {
      "id": "https://aai-test-v4.ruhr-uni-bochum.de/idp/shibboleth",
      "displayName": "Ruhr-Universitaet Bochum TEST-IDP-v4",
      "description": "Test-IdP der Ruhr-Universität Bochum für die Shibboleth v4 Migration",
      "i18n": {
        "de": {
          "displayName": "Ruhr-Universität Bochum TEST-IDP-v4",
          "description": "Test-IdP der Ruhr-Universität Bochum für die Shibboleth v4 Migration"
        },
        "en": {
          "displayName": "Ruhr-Universitaet Bochum TEST-IDP-v4",
          "description": "Test-IdP der Ruhr-Universität Bochum für die Shibboleth v4 Migration"
        }
      }
    },
    {
      "id": "https://aai-test.leibniz-gemeinschaft.de/idp/shibboleth",
      "displayName": "Leibniz-Association - Headquarters (Test-Federation)",
      "description": "IdP of the Leibniz-Association Headquarters",
      "i18n": {
        "de": {
          "displayName": "Leibniz-Gemeinschaft - Geschäftsstelle (Test-Föderation)",
          "description": "IdP der Geschäftsstelle der Leibniz-Gemeinschaft"
        },
        "en": {
          "displayName": "Leibniz-Association - Headquarters (Test-Federation)",
          "description": "IdP of the Leibniz-Association Headquarters"
        }
      }
    },
    {
      "id": "https://aai-test.provadis-hochschule.de/idp/shibboleth",
      "displayName": "Provadis School",
      "description": "Provadis School",
      "i18n": {
        "de": {
          "displayName": "Provadis Hochschule",
          "description": "Provadis Hochschule"
        },
        "en": {
          "displayName": "Provadis School",
          "description": "Provadis School"
        }
      }
    },
    {
      "id": "https://aai.dhv-speyer.de/idp/shibboleth",
      "displayName": "Universität Speyer",
      "description": "Members of the DHV Speyer",
      "i18n": {
        "de": {
          "displayName": "Universität Speyer",
          "description": "Angehörige der DHV Speyer"
        },
        "en": {
          "displayName": "Universität Speyer",
          "description": "Members of the DHV Speyer"
        }
      }
    },
    {
      "id": "https://idp-dev.hrz.tu-darmstadt.de/idp/shibboleth",
      "displayName": "Technical University of Darmstadt (development)",
      "description": "Identity Provider of TU Darmstadt (Development)",
      "i18n": {
        "de": {
          "displayName": "Technische Universität Darmstadt (development)",
          "description": "Identity Provider der TU Darmstadt (Development)"
        },
        "en": {
          "displayName": "Technical University of Darmstadt (development)",
          "description": "Identity Provider of TU Darmstadt (Development)"
        }
      }
    }];

  const { data: { idps = [] } = {} } = useQuery(
    ['idpValues'],
    () => ky('saml/configuration/idps-all').json()
  );

  const source = idps;

  // const dataOptions = idps?.map(idp => ({
  const dataOptions = source?.map(idp => ({
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
      {source?.length > 1 ?
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
                <Col md xs={12}><PatronGroupSelection defaultIdpProp={`selectedIdentityProviders[${index}]`} index={index} /></Col>
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

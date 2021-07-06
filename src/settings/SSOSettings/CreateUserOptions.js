import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import {
  Col,
  Row,
  Checkbox,
  AccordionSet,
  Accordion } from '@folio/stripes/components';
//import stripesFinalForm from '@folio/stripes/final-form';

import DefaultUserProperties from './sections/DefaultUserProperties'

const CreateUserOptions = ({initialValues}) => {
  
  
  const [createEnabled, setCreateEnabled] = useState (initialValues.userCreateMissing);
  
  return <AccordionSet>
    <Accordion
      id="CreateUserOptions"
      label={<FormattedMessage id="ui-tenant-settings.settings.saml.user.createMissingAccordion" />}
    >
      <Row>
        <Col xs={12}>
          <Field
            name="userCreateMissing"
            id="samlconfig_userCreateMissing"
            type='checkbox'
            component={({input}) => {
              const { onChange, ...inputProps } = input;
              
              return <Checkbox
                label={<FormattedMessage id="ui-tenant-settings.settings.saml.user.createMissing" />}
                inline
                checked={createEnabled}
                onChange={(event) => {
                  setCreateEnabled(!createEnabled);
                  onChange(event);
                }}
                { ...inputProps }
              />
            }}
          />
        </Col>
      </Row>
      <DefaultUserProperties
        defaultUserProp='defaultUser' />
    </Accordion>
  </AccordionSet>
}

CreateUserOptions.propTypes = {
  initialValues: PropTypes.object.isRequired,
};

export default CreateUserOptions;


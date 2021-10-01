import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Col,
  Row,
  Checkbox,
  Accordion } from '@folio/stripes/components';
// import stripesFinalForm from '@folio/stripes/final-form';

import DefaultUserProperties from './sections/DefaultUserProperties';

const extended = false;
const appendValidation = (list) => {
  if (extended === false) {
    //    list.push(({userCreateMissing}) => {
    //      const errors = {};
    //      if (userCreateMissing == true) {
    //        // Validate and add messages.
    //        errors.samlBinding = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.binding" />;
    //      }
    //      return errors;
    //    });
  }
};

const CreateUserOptions = ({ initialValues, extensionPoints }) => {
  // extend with our validation.
  appendValidation(extensionPoints);

  const [createEnabled, setCreateEnabled] = useState();

  useEffect(() => {
    if (createEnabled === undefined) {
      setCreateEnabled(initialValues.userCreateMissing);
    }
  });

  return (
    <Accordion
      id="CreateUserOptions"
      label={<FormattedMessage id="ui-tenant-settings.settings.saml.user.createMissingAccordion" />}
    >
      <Row>
        <Col xs={12}>
          <Field
            name="userCreateMissing"
            id="samlconfig_userCreateMissing"
            type="checkbox"
            component={({ input }) => {
              const { onChange, ...inputProps } = input;

              return <Checkbox
                label={<FormattedMessage id="ui-tenant-settings.settings.saml.user.createMissing" />}
                inline
                checked={createEnabled}
                onChange={(event) => {
                  setCreateEnabled(!createEnabled);
                  onChange(event);
                }}
                {...inputProps}
              />;
            }}
          />
        </Col>
      </Row>
      {createEnabled ?
        <DefaultUserProperties
          defaultUserProp="samlDefaultUser"
        />
        :
        null}
    </Accordion>
  );
};

CreateUserOptions.propTypes = {
  initialValues: PropTypes.object.isRequired,
  extensionPoints: PropTypes.arrayOf(
    PropTypes.func
  ).isRequired,
};

export default CreateUserOptions;

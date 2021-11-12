import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import {
  Accordion,
  Checkbox,
  Col,
  InfoPopover,
  Row,
} from '@folio/stripes/components';

import DefaultUserProperties from './sections/DefaultUserProperties';
import IdentityProviderProperties from './sections/IdentityProviderProperties';

const CreateUserOptions = ({ idps, initialValues }) => {
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
          <InfoPopover
            content={<FormattedMessage id="ui-tenant-settings.settings.saml.user.createMissingInfo" />}
          />
        </Col>
      </Row>
      <DefaultUserProperties
        defaultUserProp="samlDefaultUser"
      />
      <IdentityProviderProperties
        idps={idps}
      />
    </Accordion>
  );
};

CreateUserOptions.propTypes = {
  idps: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object.isRequired,
};

export default CreateUserOptions;

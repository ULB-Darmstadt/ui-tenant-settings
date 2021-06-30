import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';
//import stripesFinalForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';

const CreateUserOptions = ({initialValues}) => {
  
  const [sectionEnabled, setSectionEnabled] = useState(initialValues?.userCreateMissing == true ?? false);
  
  return <Field
    label={<FormattedMessage id="ui-tenant-settings.settings.saml.user.createMissing" />}
    name="userCreateMissing"
    id="samlconfig_userCreateMissing"
    type='checkbox'
    component={
      (props) => {
        // We wish to provide a custom onChange.
        const { onChange, ...inputProps } = props.input;
        return <Checkbox
          {...inputProps}
          onChange={(event) => {
            
            // Maintain state here too.
            setSectionEnabled(!sectionEnabled);
            
            // Call the passed onChange...
            onChange(event);
            // consume event.target.value
          }}
        />
      }
    }
    required
  />
}

CreateUserOptions.propTypes = {
  initialValues: PropTypes.object.isRequired,
};

export default CreateUserOptions;
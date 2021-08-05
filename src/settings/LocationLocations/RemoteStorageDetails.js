import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { useRemoteStorageApi } from './RemoteStorage';

const RemoteStorageDetails = ({ locationId }) => {
  const { remoteMap, configurations } = useRemoteStorageApi();

  const currentConfig = configurations?.records.find(config => remoteMap[locationId] === config.id);

  return (
    <>
      {currentConfig?.name && (
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.remoteStorage" />}
              value={currentConfig?.name}
            />
          </Col>
        </Row>
      )}

      {currentConfig?.returningWorkflowDetails && (
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.returning-workflow.title" />}
              value={
                <FormattedMessage
                  id={`ui-tenant-settings.settings.location.locations.returning-workflow.${currentConfig?.returningWorkflowDetails}`}
                />
              }
            />
          </Col>
        </Row>
      )}
    </>
  );
};

RemoteStorageDetails.propTypes = {
  locationId: PropTypes.string.isRequired,
};

export default RemoteStorageDetails;

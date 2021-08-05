import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRemoteStorageApi } from './RemoteStorage';
import RemoteStorageDetails from './RemoteStorageDetails';

const mockConfigurations = {
  records: [
    { name: 'RS1', id: 1 },
    { name: 'RS2', id: 2, returningWorkflowDetails: 'Scanned to folio' }
  ]
};

const mockRemoteMap = {
  locationWithoutDetails: 1,
  locationWithDetails: 2,
};

jest.mock('./RemoteStorage');

const renderRemoteStorageDetails = ({
  locationId
}) => (render(
  <RemoteStorageDetails locationId={locationId} />
));

describe('RemoteStorageDetails', () => {
  beforeEach(() => {
    useRemoteStorageApi.mockImplementation(() => ({ remoteMap: mockRemoteMap, configurations: mockConfigurations }));
  });

  it('should render remote storage name and workflow preference if location have them', () => {
    renderRemoteStorageDetails({ locationId: 'locationWithDetails' });

    expect(screen.getByText(/remoteStorage/)).toBeVisible();
    expect(screen.getByText(/returning-workflow.title/)).toBeVisible();
  });

  it('should render name for location with details', () => {
    renderRemoteStorageDetails({ locationId: 'locationWithDetails' });

    expect(screen.getByText('RS2')).toBeVisible();
  });

  it('should render correct result based on state changes', async () => {
    useRemoteStorageApi.mockImplementation(() => ({ remoteMap: mockRemoteMap, configurations: mockConfigurations }));
    const sut = renderRemoteStorageDetails({ locationId: 'locationWithDetails' });

    expect(screen.getByText('RS2')).toBeVisible();

    useRemoteStorageApi.mockImplementation(() => ({ remoteMap: mockRemoteMap, configurations: undefined }));
    sut.rerender(<RemoteStorageDetails locationId="locationWithDetails" />);

    expect(screen.queryByText('RS2')).not.toBeInTheDocument();
  });

  it('should not render workflow preference if location have not it', () => {
    renderRemoteStorageDetails({ locationId: 'locationWithoutDetails' });

    expect(screen.queryByText(/returning-workflow.title/)).not.toBeInTheDocument();
  });
});

import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

const useIdpUrlValues = (urlValue) => {
  const ky = useOkapiKy();
  const { data, isLoading } = useQuery(
    ['sso', 'validIdp', urlValue],
    () => ky(`saml/validate?type=idpurl&value=${urlValue}`).json(),
    { enabled: !!urlValue }
  );

  const valid = data?.valid;
  const idps = data?.idps || [];
  return [valid, idps, isLoading];
};

export default useIdpUrlValues;

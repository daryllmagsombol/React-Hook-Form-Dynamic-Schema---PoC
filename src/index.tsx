import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';

import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
const queryClient = new QueryClient();
const { data: personalInfoFields } = require('./schema/payload.json');

const _App = () => {
  const { isLoading, data } = useQuery('validate-config', async () => {
    const _value = await axios
      .get('http://localhost:3001/validation-config')
      .then(({ data: { data } }) => data)
      .catch(() => {
        console.log(
          'Error loading validation config from server. Loading defaults...'
        );
        return personalInfoFields;
      });
    return _value;
  });

  return isLoading ? 'Loading...' : <App validationConfig={data} />;
};

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <_App />
    </QueryClientProvider>
  </StrictMode>
);

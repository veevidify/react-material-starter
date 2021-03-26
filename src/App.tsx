import './App.css';

import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';

import { authenticatedRoutes, guestRoutes } from './route';

function App() {
  const routing = useRoutes(guestRoutes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    </StyledEngineProvider>

  );
}

export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Rotas from './routes';
import GlobalStyle from './theme/globalStyles';
import { ThemeProvider } from './theme/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <GlobalStyle />
        <Rotas />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

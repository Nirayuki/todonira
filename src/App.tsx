import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Rotas from './routes';
import { ThemeProvider } from './theme/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Rotas />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

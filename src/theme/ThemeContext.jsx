import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from "./theme";
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import usePersistedState from '../components/usePersistedState';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = usePersistedState('themeTodo', 'light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Após a restauração do tema, definimos o estado de carregamento como falso.
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return null; // Ou renderize um componente de carregamento ou simplesmente não renderize nada.
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

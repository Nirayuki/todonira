import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from "./theme";
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import usePersistedState from '../components/usePersistedState';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [theme, setTheme] = usePersistedState('themeTodo', 'light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    // Verifica se o tema foi carregado do armazenamento persistente
    // e marca-o como carregado.
    if (theme) {
      setThemeLoaded(true);
    }
  }, [theme]);

  if (!themeLoaded) {
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
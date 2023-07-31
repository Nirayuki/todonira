import React, { createContext } from 'react';
import { lightTheme, darkTheme } from "./theme";
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import usePersistedState from '../components/usePersistedState';


export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = usePersistedState('themeTodo', 'light');


    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <StyledThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
            {children}
          </StyledThemeProvider>
        </ThemeContext.Provider>
      );
}
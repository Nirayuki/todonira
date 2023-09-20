import React, { createContext, useState, useEffect } from 'react';
import usePersistedState from '../components/usePersistedState';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [themeLoaded, setThemeLoaded] = useState(false);
  const [theme, setTheme] = usePersistedState('themeTodo', 'light');

  const toggleTheme = () => {
    console.log("caiu aqui no tema");
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));

    if(theme === "dark"){
      document.documentElement.setAttribute("data-theme", "dark");
    }else{
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  useEffect(() => {
    // Verifica se o tema foi carregado do armazenamento persistente
    // e marca-o como carregado.
    if (theme) {
      if(theme === "dark"){
        document.documentElement.setAttribute("data-theme", "dark");
      }else{
        document.documentElement.setAttribute("data-theme", "light");
      }
      setThemeLoaded(true);
    }
  }, [theme]);

  if (!themeLoaded) {
    return null; // Ou renderize um componente de carregamento ou simplesmente não renderize nada.
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
  );
};
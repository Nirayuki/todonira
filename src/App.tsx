import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Rotas from './routes';

function App() {
  return (
    <BrowserRouter>
      <Rotas/>
    </BrowserRouter>
  );
}

export default App;

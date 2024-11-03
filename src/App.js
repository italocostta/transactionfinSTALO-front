import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';  
import Transacoes from './pages/Transacoes'; 
import CriarTransacao from './pages/CriarTransacao';  
import EditarTransacao from './pages/EditarTransacao';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/criar-transacao" element={<CriarTransacao />} />
        <Route path="/editar-transacao/:id" element={<EditarTransacao />} />
      </Routes>
    </Router>
  );
}

export default App;

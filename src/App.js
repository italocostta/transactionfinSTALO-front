import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';  // Atualize o caminho para a nova localização
import Transacoes from './pages/Transacoes';  // Atualize o caminho para a nova localização
import CriarTransacao from './pages/CriarTransacao';  // Atualize o caminho para a nova localização

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/criar-transacao" element={<CriarTransacao />} />
      </Routes>
    </Router>
  );
}

export default App;

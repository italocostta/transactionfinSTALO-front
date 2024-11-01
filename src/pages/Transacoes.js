import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Transacoes.css';
import { FaEllipsisV } from 'react-icons/fa';

const Transacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    const mockTransacoes = [
      {
        id: 1,
        valor: 200,
        status: 'Em processamento',
        dataCriacao: '01/01/2020 10:00:00',
      },
      {
        id: 2,
        valor: 400,
        status: 'Aprovada',
        dataCriacao: '01/01/2020 11:00:00',
      },
      {
        id: 3,
        valor: 340,
        status: 'Em processamento',
        dataCriacao: '01/01/2020 12:00:00',
      },
    ];
    setTransacoes(mockTransacoes);
  }, []);

  const handleVerTransacao = (id) => {
    alert(`Visualizar transação ID: ${id}`);
  };

  const handleEditarTransacao = (id) => {
    alert(`Editar transação ID: ${id}`);
  };

  const handleExcluirTransacao = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      alert(`Excluir transação ID: ${id}`);
    }
  };

  return (
    <div className="transacoes-container">
      <header className="transacoes-header">
        <h2>Transações</h2>
        <button className="criar-transacao-button" onClick={() => navigate('/criar-transacao')}>Criar Transação</button>
      </header>
      <div className="transacoes-lista">
        {transacoes.map((transacao) => (
          <div key={transacao.id} className="transacao-item">
            <div className="transacao-info">
              <p>R$ {transacao.valor} - {transacao.status} - {transacao.dataCriacao}</p>
            </div>
            <div className="transacao-opcoes">
              <FaEllipsisV />
              <div className="dropdown-opcoes">
                <button onClick={() => handleVerTransacao(transacao.id)}>Ver</button>
                <button onClick={() => handleEditarTransacao(transacao.id)}>Editar</button>
                <button onClick={() => handleExcluirTransacao(transacao.id)}>Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transacoes;
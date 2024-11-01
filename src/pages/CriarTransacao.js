import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/CriarTransacao.css';

const CriarTransacao = () => {
  const [valor, setValor] = useState('');
  const [cpf, setCpf] = useState('');
  const [documento, setDocumento] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar a transação para o backend
    console.log({ valor, cpf, documento });
    alert('Transação criada com sucesso!');
    navigate('/transacoes');
  };

  return (
    <div className="criar-transacao-container">
      <h2>Criar Transação</h2>
      <form onSubmit={handleSubmit} className="criar-transacao-form">
        <div className="form-group">
          <label>Valor da Transação (R$):</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>CPF do Portador:</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Documento (PDF ou Imagem):</label>
          <input
            type="file"
            onChange={(e) => setDocumento(e.target.files[0])}
            accept=".pdf,image/*"
          />
        </div>
        <button type="submit" className="salvar-transacao-button">Salvar</button>
      </form>
    </div>
  );
};

export default CriarTransacao;

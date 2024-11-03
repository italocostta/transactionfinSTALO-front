import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CriarTransacao.css';

function CriarTransacao() {
  const [valor, setValor] = useState('');
  const [cpf, setCpf] = useState('');
  const [documento, setDocumento] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleValorChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(numericValue / 100);

    setValor(formattedValue);
  };

 
  const handleCpfChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    let formattedCpf = inputValue;

    if (formattedCpf.length > 3) {
      formattedCpf = formattedCpf.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (formattedCpf.length > 7) {
      formattedCpf = formattedCpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (formattedCpf.length > 11) {
      formattedCpf = formattedCpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    setCpf(formattedCpf);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado.');
        navigate('/login');
        return;
      }

      
      const numericValue = parseFloat(valor.replace(/[R$.]/g, '').replace(',', '.'));
      const transacao = {
        valor: numericValue,
        cpf: cpf.replace(/\D/g, ''),
        status: 'EM_PROCESSAMENTO', 
      };

      const formData = new FormData();
      formData.append(
        'transacao',
        new Blob([JSON.stringify(transacao)], {
          type: 'application/json',
        })
      );

      if (documento) {
        formData.append('documento', documento);
      }

      await api.post('/transacoes', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/transacoes');
    } catch (err) {
      setError('Erro ao criar transação. Tente novamente.');
    }
  };

  return (
    <div className="criar-transacao-container">
      <h2>Criar Transação</h2>
      <form onSubmit={handleSubmit} className="criar-transacao-form">
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label>Valor da Transação (R$):</label>
          <input
            type="text"
            value={valor}
            onChange={handleValorChange}
            required
          />
        </div>
        <div className="input-group">
          <label>CPF:</label>
          <input
            type="text"
            value={cpf}
            onChange={handleCpfChange}
            maxLength="14"
            required
          />
        </div>
        <div className="input-group">
          <label>Comprovante (PDF/Imagem):</label>
          <input
            type="file"
            onChange={(e) => setDocumento(e.target.files[0])}
            accept="application/pdf, image/*"
          />
        </div>
        <button type="submit" className="criar-transacao-button">
          Salvar
        </button>
        <button
          type="button"
          className="cancelar-transacao-button"
          onClick={() => navigate('/transacoes')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default CriarTransacao;

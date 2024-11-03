import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/CriarTransacao.css';

function EditarTransacao() {
  const [valor, setValor] = useState('');
  const [cpf, setCpf] = useState('');
  const [documento, setDocumento] = useState(null);
  const [status, setStatus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTransacao = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token) {
          setError('Usuário não autenticado.');
          navigate('/login');
          return;
        }

        // Verifica se o usuário é admin
        setIsAdmin(role === 'ADMIN');

        // Busca a transação pelo ID
        const response = await api.get(`/transacoes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transacao = response.data;
        setValor(new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
        }).format(transacao.valor));
        setCpf(transacao.cpf);
        setStatus(transacao.status);
      } catch (err) {
        setError('Erro ao buscar transação. Tente novamente mais tarde.');
      }
    };

    fetchTransacao();
  }, [id, navigate]);

  // Função para formatar o valor da transação no padrão de moeda brasileira
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado.');
        navigate('/login');
        return;
      }

      // Prepara o objeto de dados que deve ser enviado, excluindo o CPF
      const numericValue = parseFloat(valor.replace(/[R$.]/g, '').replace(',', '.'));
      const transacaoAtualizada = {
        valor: numericValue,
        ...(isAdmin && { status }), // Envia o status apenas se o usuário for admin
      };

      const formData = new FormData();
      formData.append(
        'transacao',
        new Blob([JSON.stringify(transacaoAtualizada)], {
          type: 'application/json',
        })
      );
      if (documento) {
        formData.append('documento', documento);
      }

      await api.put(`/transacoes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/transacoes');
    } catch (err) {
      setError('Erro ao editar transação. Tente novamente.');
    }
  };

  const formatarCpf = (cpf) => {
    return `${cpf.substring(0, 3)}.***.***-${cpf.substring(cpf.length - 2)}`;
  };

  return (
    <div className="criar-transacao-container">
      <h2>Editar Transação</h2>
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
          <input type="text" value={formatarCpf(cpf)} disabled />
        </div>
        {isAdmin && (
          <div className="input-group">
            <label>Status da Transação:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="EM_PROCESSAMENTO">Em processamento</option>
              <option value="APROVADA">Aprovada</option>
              <option value="NEGADA">Negada</option>
            </select>
          </div>
        )}
        <div className="input-group">
          <label>Comprovante (PDF/Imagem):</label>
          <input
            type="file"
            onChange={(e) => setDocumento(e.target.files[0])}
            accept="application/pdf, image/*"
          />
        </div>
        <button type="submit" className="criar-transacao-button">
          Salvar Alterações
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

export default EditarTransacao;

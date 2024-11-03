import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Transacoes.css';
import { FaEllipsisV } from 'react-icons/fa';
import Modal from 'react-modal';

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [error, setError] = useState('');
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [transacaoParaExcluir, setTransacaoParaExcluir] = useState(null);
  const navigate = useNavigate();

  function formatarStatus(status) {
    switch (status) {
      case 'EM_PROCESSAMENTO':
        return 'Em processamento';
      case 'APROVADA':
        return 'Aprovada';
      case 'NEGADA':
        return 'Negada';
      default:
        return status;
    }
  }

  function formatarCpf(cpf) {
    return `${cpf.substring(0, 3)}.***.***-${cpf.substring(cpf.length - 2)}`;
  }

  function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/transacoes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransacoes(response.data);
      } catch (err) {
        setError('Erro ao buscar transações. Tente novamente mais tarde.');
      }
    };

    fetchTransacoes();
  }, [navigate]);

  const handleExcluir = async () => {
    try {
      const token = localStorage.getItem('token');

      await api.delete(`/transacoes/${transacaoParaExcluir.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransacoes(transacoes.filter((transacao) => transacao.id !== transacaoParaExcluir.id));
      closeExcluirModal();
    } catch (err) {
      setError('Erro ao excluir a transação. Tente novamente mais tarde.');
    }
  };

  const openModal = (transacao) => {
    setTransacaoSelecionada(transacao);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTransacaoSelecionada(null);
  };

  const openExcluirModal = (transacao) => {
    setTransacaoParaExcluir(transacao);
    setIsExcluirModalOpen(true);
  };

  const closeExcluirModal = () => {
    setIsExcluirModalOpen(false);
    setTransacaoParaExcluir(null);
  };

  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <h2 className="transacoes-title">Transações</h2>
        <div className="transacoes-actions">
          <button
            className="criar-transacao-button"
            onClick={() => navigate('/criar-transacao')}
          >
            Criar Transação
          </button>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="transacoes-lista">
        {transacoes.length === 0 ? (
          <p className="no-transacoes">Nenhuma transação encontrada.</p>
        ) : (
          transacoes.map((transacao) => (
            <div key={transacao.id} className="transacao-item">
              <div className="transacao-coluna transacao-data">
                <p>
                  {transacao.dataAtualizacao && transacao.dataAtualizacao !== transacao.dataCriacao
                    ? `Atualizado em: ${new Date(transacao.dataAtualizacao).toLocaleString()}`
                    : `Criado em: ${new Date(transacao.dataCriacao).toLocaleString()}`}
                </p>
              </div>
              <div className="transacao-coluna transacao-detalhes">
                <p>Valor: {formatarValor(transacao.valor)}</p>
                <p>Status: {formatarStatus(transacao.status)}</p>
              </div>
              <div className="transacao-opcoes">
                <FaEllipsisV className="opcoes-icon" />
                <div className="dropdown-opcoes">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(transacao);
                    }}
                  >
                    Ver
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editar-transacao/${transacao.id}`);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openExcluirModal(transacao);
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {transacaoSelecionada && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Detalhes da Transação"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Detalhes da Transação</h2>
          <p>Valor: {formatarValor(transacaoSelecionada.valor)}</p>
          <p>Status: {formatarStatus(transacaoSelecionada.status)}</p>
          <p>
            {transacaoSelecionada.dataAtualizacao && transacaoSelecionada.dataAtualizacao !== transacaoSelecionada.dataCriacao
              ? `Atualizado em: ${new Date(transacaoSelecionada.dataAtualizacao).toLocaleString()}`
              : `Criado em: ${new Date(transacaoSelecionada.dataCriacao).toLocaleString()}`}
          </p>
          <p>CPF: {formatarCpf(transacaoSelecionada.cpf)}</p>
          <button onClick={closeModal} className="fechar-modal-button">
            Fechar
          </button>
        </Modal>
      )}

      {isExcluirModalOpen && (
        <Modal
          isOpen={isExcluirModalOpen}
          onRequestClose={closeExcluirModal}
          contentLabel="Confirmar Exclusão"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Confirmar Exclusão</h2>
          <p>Tem certeza que deseja excluir a transação selecionada?</p>
          <div className="excluir-modal-actions">
            <button onClick={handleExcluir} className="excluir-button">
              Confirmar
            </button>
            <button onClick={closeExcluirModal} className="cancelar-button">
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Transacoes;

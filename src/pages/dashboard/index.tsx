import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState<{ name: string; value: number } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState<{ description: string; value: number; type: number }>({
    description: '',
    value: 0,
    type: 1
  });
  const [transactionToEdit, setTransactionToEdit] = useState<any | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('user_id');
        
        if (!token || !userId) {
          console.log('Token or user_id not found. Redirecting to login...');
          // Redirecione para a página de login se necessário
          return;
        }

        const userResponse = await axios.get(`http://localhost:3002/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

        const transactionsResponse = await axios.get(`http://localhost:3002/transaction/list?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNewTransaction = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('user_id');
      
      if (!token || !userId) {
        console.log('Token or user_id not found.');
        return;
      }

      await axios.post('http://localhost:3002/transaction', {
        user_Id: Number(userId),
        value: newTransaction.value,
        description: newTransaction.description,
        type: newTransaction.type
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Atualize a lista de transações após criar uma nova
      const transactionsResponse = await axios.get(`http://localhost:3002/transaction/list?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(transactionsResponse.data);
      setIsCreatingTransaction(false);
      setNewTransaction({ description: '', value: 0, type: 1 });
    } catch (error) {
      console.error('Error creating transaction:', error.response?.data || error.message);
    }
  };

  const handleEditTransaction = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token || !transactionToEdit) {
        console.log('Token or transactionToEdit not found.');
        return;
      }

      await axios.patch(`http://localhost:3002/transaction/${transactionToEdit.id}`, {
        user_Id: Number(localStorage.getItem('user_id')),
        value: transactionToEdit.value,
        description: transactionToEdit.description,
        type: transactionToEdit.type
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Atualize a lista de transações após a edição
      const userId = localStorage.getItem('user_id');
      if (userId) {
        const transactionsResponse = await axios.get(`http://localhost:3002/transaction/list?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(transactionsResponse.data);
      }

      setIsEditingTransaction(false);
      setTransactionToEdit(null);
    } catch (error) {
      console.error('Error editing transaction:', error.response?.data || error.message);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token || !transactionToDelete) {
        console.log('Token or transactionToDelete not found.');
        return;
      }

      await axios.delete(`http://localhost:3002/transaction/${transactionToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Atualize a lista de transações após a exclusão
      const userId = localStorage.getItem('user_id');
      if (userId) {
        const transactionsResponse = await axios.get(`http://localhost:3002/transaction/list?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(transactionsResponse.data);
      }

      setIsDeletingTransaction(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Error deleting transaction:', error.response?.data || error.message);
    }
  };

  const getBalanceColor = (value: number) => {
    if (value > 0) return 'text-blue-600';
    if (value === 0) return 'text-black';
    return 'text-red-600';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 z-50"
      >
        ☰
      </button>

      {/* Menu lateral */}
      <div className={`fixed inset-0 z-40 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-white w-64 shadow-lg`}>
        <div className="p-6">
          <button onClick={toggleMenu} className="text-black">
            ✕
          </button>
          <nav className="mt-8">
            <ul>
              <li className="mb-4"><a className="text-green-600" onClick={toggleProfile}>Perfil</a></li>
              <li><a href="/login" className="text-green-600">Logout</a></li>
            </ul>
          </nav>
        </div>
        {showProfile && (
          <div className="p-6 border-t border-gray-300">
            <h2 className="text-lg text-green-600">Informações do Usuário</h2>
            <p className="text-gray-700 mt-2">Nome: {user.name}</p>
            <p className="text-gray-700">Email: {user.email}</p>
            <p className="text-gray-700">Saldo: R${user.value.toFixed(2)}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
          <h1 className="text-4xl mb-2 text-green-700 text-center">Bem-vindo, {user.name}!</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
          <h2 className="text-2xl mb-4 text-green-600 text-center">Saldo Atual</h2>
          <p className={`text-xl text-center ${getBalanceColor(user.value)}`}>
            R${user.value.toFixed(2)}
          </p>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-green-600">Transações</h2>
          <button
            onClick={() => setIsCreatingTransaction(true)}
            className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Nova Transação
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-3 bg-green-200 text-green-800">Descrição</th>
              <th className="border border-gray-300 p-3 bg-green-200 text-green-800">Valor</th>
              <th className="border border-gray-300 p-3 bg-green-200 text-green-800">Tipo</th>
              <th className="border border-gray-300 p-3 bg-green-200 text-green-800">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-3 text-gray-800">{transaction.description}</td>
                <td className={`border border-gray-300 p-3 ${getBalanceColor(transaction.value)}`}>
                  R${transaction.value.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-3 text-gray-800">
                  {transaction.type === 1 ? 'Entrada' : 'Saída'}
                </td>
                <td className="border border-gray-300 p-3">
                  <button
                    onClick={() => {
                      setTransactionToEdit(transaction);
                      setIsEditingTransaction(true);
                    }}
                    className="bg-yellow-500 text-white py-1 px-2 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setTransactionToDelete(transaction);
                      setIsDeletingTransaction(true);
                    }}
                    className="bg-red-500 text-white py-1 px-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {isCreatingTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl mb-4 text-green-600 text-center">Criar Nova Transação</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleNewTransaction();
            }}>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700">Descrição</label>
                <input
                  type="text"
                  id="description"
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="value" className="block text-gray-700">Valor</label>
                <input
                  type="number"
                  id="value"
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  value={newTransaction.value}
                  onChange={(e) => setNewTransaction({ ...newTransaction, value: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700">Tipo</label>
                <select
                  id="type"
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: Number(e.target.value) })}
                  required
                >
                  <option value={1}>Entrada</option>
                  <option value={2}>Saída</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingTransaction(false)}
                  className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {isEditingTransaction && transactionToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl mb-4 text-yellow-600 text-center">Editar Transação</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditTransaction();
            }}>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700">Descrição</label>
                <input
                  type="text"
                  id="description"
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  value={transactionToEdit.description}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="value" className="block text-gray-700">Valor</label>
                <input
                  type="number"
                  id="value"
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  value={transactionToEdit.value}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, value: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700">Tipo</label>
                <select
                  id="type"
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  value={transactionToEdit.type}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, type: Number(e.target.value) })}
                  required
                >
                  <option value={1}>Entrada</option>
                  <option value={2}>Saída</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Atualizar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTransaction(false)}
                  className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {isDeletingTransaction && transactionToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl mb-4 text-red-600 text-center">Excluir Transação</h2>
            <div className="mb-4">
              <p><strong>Descrição:</strong> {transactionToDelete.description}</p>
              <p><strong>Valor:</strong> R${transactionToDelete.value.toFixed(2)}</p>
              <p><strong>Tipo:</strong> {transactionToDelete.type === 1 ? 'Entrada' : 'Saída'}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteTransaction}
                className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Excluir
              </button>
              <button
                type="button"
                onClick={() => setIsDeletingTransaction(false)}
                className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


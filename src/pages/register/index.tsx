import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState(0.00);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3002/auth/register', {
        email,
        password,
        name,
        value,
      });

      // Você pode redirecionar o usuário para a tela de login ou outra tela após o registro
      router.push('/login');
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setError(error.response?.data?.message || 'Algo deu errado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Registrar</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="value" className="block text-gray-700 text-sm font-medium mb-2">Valor</label>
            <input
              type="number"
              id="value"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              step="0.01"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Registrar
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-600">Já tem uma conta? <a href="/login" className="text-green-500 font-semibold">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
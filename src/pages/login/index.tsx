import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3002/auth/login', { email, password });
      const { token, user_id } = response.data;
      const accessToken = token?.accessToken;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user_id', user_id);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setError(error.response?.data?.message || 'Algo deu errado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Login</h2>
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
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-600">Não tem uma conta? <a href="/register" className="text-green-500 font-semibold">Registrar</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


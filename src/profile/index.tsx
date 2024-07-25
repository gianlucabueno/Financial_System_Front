import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Profile = () => {
  const [user, setUser] = useState<{ name: string; email: string; value: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');

        if (!token || !userId) {
          // Se não estiver autenticado, redirecione para a página de login
          router.push('/login');
          return;
        }

        // Requisição para obter os dados do usuário
        const userResponse = await axios.get(`http://localhost:3002/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("userResponse")
        console.log(userResponse)

        setUser(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Se houver um erro, redirecione para a página de login
        router.push('/login');
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não encontrado.</div>;

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-4xl mb-6 text-green-700 text-center">Perfil do Usuário</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
          <p className="text-gray-900">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Saldo Atual:</label>
          <p className={`text-gray-900 ${user.value > 0 ? 'text-blue-600' : user.value < 0 ? 'text-red-600' : 'text-black'}`}>
            R${user.value.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import Link from 'next/link';

const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl mb-6">Financial Dashboard</h1>
    <div className="space-x-4">
      <Link href="/login">
      <button className="bg-blue-500 text-white p-2 rounded">Login</button>
      </Link>
    </div>
  </div>
);


export default Home;

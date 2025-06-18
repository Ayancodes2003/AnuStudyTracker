import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blush">
      <form onSubmit={handleSubmit} className="bg-white/80 rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col gap-4 border-2 border-lilac">
        <h2 className="text-2xl font-quicksand text-pink-400 mb-2 text-center">{isRegister ? 'Sign Up' : 'Login'}</h2>
        <input
          className="rounded px-3 py-2 border border-lilac focus:outline-none focus:ring-2 focus:ring-pink-200 font-quicksand"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded px-3 py-2 border border-lilac focus:outline-none focus:ring-2 focus:ring-pink-200 font-quicksand"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-xs text-red-400 text-center">{error}</div>}
        <button
          className="bg-pink-400 text-white rounded-lg py-2 font-quicksand hover:bg-pink-500 transition-all"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Login'}
        </button>
        <button
          type="button"
          className="text-xs text-lilac hover:underline mt-2"
          onClick={() => setIsRegister((v) => !v)}
        >
          {isRegister ? 'Already have an account? Login' : 'No account? Sign up'}
        </button>
      </form>
    </div>
  );
};

export default Login; 
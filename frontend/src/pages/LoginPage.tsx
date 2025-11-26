import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(correo, password);
      // Si el login es correcto, el contexto se actualiza
      // y AppRouter te redirige al /dashboard
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800/80 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Veterinaria <span className="text-emerald-400">Full</span> – Login
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/40 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Correo</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold transition disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

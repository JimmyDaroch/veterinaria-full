import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('CLIENTE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(nombre, correo, password, rol);
      // Al registrarse, AuthContext guarda user+token
      // y AppRouter te mandará al /dashboard
    } catch (err) {
      setError('No se pudo registrar. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800/80 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Veterinaria <span className="text-emerald-400">Full</span> – Registro
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/40 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nombre completo</label>
            <input
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

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

          <div>
            <label className="block text-sm mb-1">Rol</label>
            <select
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="CLIENTE">Cliente</option>
              <option value="RECEPCIONISTA">Recepcionista</option>
              <option value="VETERINARIO">Veterinario</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold transition disabled:opacity-60"
          >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

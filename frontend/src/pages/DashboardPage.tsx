import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rol = user.rol; // 'CLIENTE' | 'RECEPCIONISTA' | 'VETERINARIO' | 'ADMIN'

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (rol === 'CLIENTE') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            Hola, {user.nombre} 👋
          </h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Cerrar sesión
          </button>
        </div>

        <p className="text-slate-300 mb-6">
          Bienvenido al portal de cliente de la veterinaria.
        </p>

        <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
          <Link
            to="/mascotas"
            className="block rounded-xl border border-slate-700 bg-slate-800/70 p-4 hover:border-emerald-400 hover:bg-slate-800 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Mis mascotas</h2>
            <p className="text-sm text-slate-300">
              Registra y administra las mascotas que atenderás en la veterinaria.
            </p>
          </Link>

          <Link
            to="/citas"
            className="block rounded-xl border border-slate-700 bg-slate-800/70 p-4 hover:border-sky-400 hover:bg-slate-800 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Mis citas</h2>
            <p className="text-sm text-slate-300">
              Agenda nuevas citas y revisa el historial de atenciones.
            </p>
          </Link>
        </div>
      </div>
    );
  }

  if (rol === 'RECEPCIONISTA') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            Panel de recepción 📝
          </h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Cerrar sesión
          </button>
        </div>

        <p className="text-slate-300 mb-6">
          Aquí podrás gestionar la agenda completa de la veterinaria.
        </p>

        <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
          <Link
            to="/citas"
            className="block rounded-xl border border-slate-700 bg-slate-800/70 p-4 hover:border-sky-400 hover:bg-slate-800 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Agenda de citas</h2>
            <p className="text-sm text-slate-300">
              Ver y administrar todas las citas de los clientes.
            </p>
          </Link>

          <div className="block rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-slate-400">
            <h2 className="font-semibold text-lg mb-1">Lista de espera</h2>
            <p className="text-sm">
              Próximamente: gestión de lista de espera y reasignación de horas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (rol === 'VETERINARIO') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            Panel del veterinario 🩺
          </h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Cerrar sesión
          </button>
        </div>

        <p className="text-slate-300 mb-6">
          Revisa tus atenciones y el historial clínico de las mascotas.
        </p>

        <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
          <Link
            to="/citas"
            className="block rounded-xl border border-slate-700 bg-slate-800/70 p-4 hover:border-emerald-400 hover:bg-slate-800 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Citas asignadas</h2>
            <p className="text-sm text-slate-300">
              Ver las citas que tienes para hoy y los próximos días.
            </p>
          </Link>

          <div className="block rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-slate-400">
            <h2 className="font-semibold text-lg mb-1">Consultas</h2>
            <p className="text-sm">
              Próximamente: registro de consultas y evolución de pacientes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN u otros roles
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">
          Panel de administración ⚙️
        </h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="text-slate-300 mb-6">
        Resumen general del sistema de la veterinaria.
      </p>

      <div className="grid gap-4 md:grid-cols-3 max-w-5xl">
        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <h2 className="font-semibold text-lg mb-1">Clientes</h2>
          <p className="text-sm text-slate-300">
            Próximamente: listado y gestión de clientes registrados.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <h2 className="font-semibold text-lg mb-1">Citas</h2>
          <p className="text-sm text-slate-300">
            Próximamente: vista global de todas las citas y estados.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <h2 className="font-semibold text-lg mb-1">Productos</h2>
          <p className="text-sm text-slate-300">
            Próximamente: control de stock y reservas de productos.
          </p>
        </div>
      </div>
    </div>
  );
};

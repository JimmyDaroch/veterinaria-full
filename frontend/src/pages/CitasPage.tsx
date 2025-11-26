// frontend/src/pages/CitasPage.tsx
import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
};

type Cita = {
  id: number;
  fecha: string;
  motivo: string | null;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  mascota: Mascota;
};

export const CitasPage = () => {
  const { token } = useAuth();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotaId, setMascotaId] = useState<number | ''>('');
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);

  // estado para edición
  const [editId, setEditId] = useState<number | null>(null);
  const [editFecha, setEditFecha] = useState('');
  const [editMotivo, setEditMotivo] = useState('');

  const API_MASCOTAS = 'http://localhost:4000/api/mascotas';
  const API_CITAS = 'http://localhost:4000/api/citas';

  const cargarMascotas = async () => {
    try {
      const res = await fetch(API_MASCOTAS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMascotas(data);
    } catch {
      setError('No se pudieron cargar las mascotas');
    }
  };

  const cargarCitas = async () => {
    try {
      const res = await fetch(API_CITAS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCitas(data);
    } catch {
      setError('No se pudieron cargar las citas');
    }
  };

  useEffect(() => {
    if (token) {
      setError(null);
      cargarMascotas();
      cargarCitas();
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mascotaId || !fecha) {
      setError('Selecciona una mascota y una fecha');
      return;
    }
    try {
      setError(null);
      const res = await fetch(API_CITAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mascotaId,
          fecha,
          motivo,
        }),
      });
      if (!res.ok) throw new Error();
      setMascotaId('');
      setFecha('');
      setMotivo('');
      await cargarCitas();
    } catch {
      setError('No se pudo crear la cita');
    }
  };

  const cancelarCita = async (id: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_CITAS}/${id}/cancelar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      await cargarCitas();
    } catch {
      setError('No se pudo cancelar la cita');
    }
  };

  const completarCita = async (id: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_CITAS}/${id}/completar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      await cargarCitas();
    } catch {
      setError('No se pudo completar la cita');
    }
  };

  const iniciarEdicion = (cita: Cita) => {
    setEditId(cita.id);
    // adaptar fecha ISO a input datetime-local
    const fechaLocal = new Date(cita.fecha);
    const isoLocal = new Date(
      fechaLocal.getTime() - fechaLocal.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);

    setEditFecha(isoLocal);
    setEditMotivo(cita.motivo || '');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditFecha('');
    setEditMotivo('');
  };

  const guardarEdicion = async (id: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_CITAS}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha: editFecha,
          motivo: editMotivo,
        }),
      });
      if (!res.ok) throw new Error();
      await cargarCitas();
      cancelarEdicion();
    } catch {
      setError('No se pudo actualizar la cita');
    }
  };

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const estadoLabel = (estado: Cita['estado']) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'pendiente';
      case 'CONFIRMADA':
        return 'confirmada';
      case 'CANCELADA':
        return 'cancelada';
      case 'COMPLETADA':
        return 'completada';
      default:
        return estado.toLowerCase();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Mis citas</h1>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-900/40 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Formulario nueva cita */}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md mb-8">
        <div>
          <label className="block text-sm mb-1">Mascota</label>
          <select
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={mascotaId}
            onChange={(e) =>
              setMascotaId(e.target.value === '' ? '' : Number(e.target.value))
            }
          >
            <option value="">Selecciona una mascota</option>
            {mascotas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} — {m.especie}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Fecha y hora</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Motivo (opcional)</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        <button className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold">
          Crear cita
        </button>
      </form>

      {/* Listado de citas */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Citas agendadas</h2>
        {citas.length === 0 ? (
          <p className="text-slate-400">Aún no tienes citas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {citas.map((cita) => (
              <li
                key={cita.id}
                className="bg-slate-800/70 rounded px-3 py-2 border border-slate-700"
              >
                {editId === cita.id ? (
                  // MODO EDICIÓN
                  <div className="space-y-2">
                    <div className="font-semibold">
                      Editar cita de {cita.mascota?.nombre}
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Fecha y hora
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
                        value={editFecha}
                        onChange={(e) => setEditFecha(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Motivo</label>
                      <input
                        className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
                        value={editMotivo}
                        onChange={(e) => setEditMotivo(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => guardarEdicion(cita.id)}
                        className="px-3 py-1 text-sm rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold"
                      >
                        Guardar cambios
                      </button>
                      <button
                        type="button"
                        onClick={cancelarEdicion}
                        className="px-3 py-1 text-sm rounded bg-slate-600 hover:bg-slate-500 text-slate-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // MODO NORMAL
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <div className="font-semibold">
                        {cita.mascota?.nombre} — {cita.mascota?.especie}
                      </div>
                      <div className="text-sm text-slate-300">
                        {formatFecha(cita.fecha)} ·{' '}
                        {cita.motivo || 'Sin motivo'}
                      </div>
                      <div className="text-xs mt-1">
                        Estado:{' '}
                        <span className="font-semibold">
                          {estadoLabel(cita.estado)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      {cita.estado !== 'CANCELADA' &&
                        cita.estado !== 'COMPLETADA' && (
                          <>
                            <button
                              type="button"
                              onClick={() => iniciarEdicion(cita)}
                              className="px-3 py-1 text-xs rounded bg-sky-500 hover:bg-sky-600 text-slate-900 font-semibold"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => completarCita(cita.id)}
                              className="px-3 py-1 text-xs rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold"
                            >
                              Marcar completada
                            </button>
                          </>
                        )}
                      {cita.estado === 'PENDIENTE' && (
                        <button
                          type="button"
                          onClick={() => cancelarCita(cita.id)}
                          className="px-3 py-1 text-xs rounded bg-red-500 hover:bg-red-600 text-white"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

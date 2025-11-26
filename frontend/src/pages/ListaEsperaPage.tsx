import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
};

type ItemListaEspera = {
  id: number;
  motivo: string | null;
  fecha: string; // ISO
  mascota: Mascota;
};

export const ListaEsperaPage = () => {
  const { token } = useAuth();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [items, setItems] = useState<ItemListaEspera[]>([]);

  const [mascotaId, setMascotaId] = useState<number | ''>('');
  const [motivo, setMotivo] = useState('');
  const [fechaDeseada, setFechaDeseada] = useState('');
  const [error, setError] = useState<string | null>(null);

  const API_MASCOTAS = 'http://localhost:4000/api/mascotas';
  const API_LISTA = 'http://localhost:4000/api/lista-espera';

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

  const cargarLista = async () => {
    try {
      const res = await fetch(API_LISTA, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data);
    } catch {
      setError('No se pudo cargar la lista de espera');
    }
  };

  useEffect(() => {
    if (token) {
      setError(null);
      cargarMascotas();
      cargarLista();
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mascotaId) {
      setError('Selecciona una mascota');
      return;
    }

    try {
      setError(null);
      const res = await fetch(API_LISTA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mascotaId,
          motivo,
          fechaDeseada: fechaDeseada || null,
        }),
      });

      if (!res.ok) throw new Error();

      setMascotaId('');
      setMotivo('');
      setFechaDeseada('');
      await cargarLista();
    } catch {
      setError('No se pudo agregar a la lista de espera');
    }
  };

  const eliminarItem = async (id: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_LISTA}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      await cargarLista();
    } catch {
      setError('No se pudo eliminar de la lista de espera');
    }
  };

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de espera</h1>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-900/40 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Formulario */}
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
          <label className="block text-sm mb-1">Motivo (opcional)</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: horario fuera de agenda, sin horas disponibles..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Fecha deseada (opcional)
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={fechaDeseada}
            onChange={(e) => setFechaDeseada(e.target.value)}
          />
        </div>

        <button className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold">
          Agregar a lista de espera
        </button>
      </form>

      {/* Listado */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Mis solicitudes</h2>
        {items.length === 0 ? (
          <p className="text-slate-400">
            Aún no tienes solicitudes en la lista de espera.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-slate-800/70 rounded px-3 py-2 border border-slate-700 flex justify-between items-center gap-3"
              >
                <div>
                  <div className="font-semibold">
                    {item.mascota?.nombre} — {item.mascota?.especie}
                  </div>
                  <div className="text-sm text-slate-300">
                    Solicitado: {formatFecha(item.fecha)}
                  </div>
                  {item.motivo && (
                    <div className="text-xs text-slate-400 mt-1">
                      Motivo: {item.motivo}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => eliminarItem(item.id)}
                  className="px-3 py-1 text-xs rounded bg-red-500 hover:bg-red-600 text-white"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

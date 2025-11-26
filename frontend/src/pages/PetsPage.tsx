import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number | null;
};

export const PetsPage = () => {
  const { token } = useAuth();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:4000/api/mascotas';

  const cargarMascotas = async () => {
    try {
      setError(null);
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al cargar mascotas');
      const data = await res.json();
      setMascotas(data);
    } catch {
      setError('No se pudieron cargar las mascotas');
    }
  };

  useEffect(() => {
    if (token) {
      cargarMascotas();
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      const edadEntera =
        edad === '' || Number.isNaN(Number(edad))
          ? null
          : Math.round(Number(edad));

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          especie,
          raza,
          edad: edadEntera,
        }),
      });

      if (!res.ok) throw new Error('Error al crear mascota');

      setNombre('');
      setEspecie('Perro');
      setRaza('');
      setEdad('');
      await cargarMascotas();
    } catch {
      setError('No se pudo crear la mascota');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Mis mascotas</h1>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-900/40 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md mb-8">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Especie</label>
          <select
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
          >
            <option>Perro</option>
            <option>Gato</option>
            <option>Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Raza (opcional)</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Edad (años, opcional)</label>
          <input
            type="number"
            step="1"
            min="0"
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"
            value={edad}
            onChange={(e) =>
              setEdad(e.target.value === '' ? '' : Number(e.target.value))
            }
          />
        </div>

        <button className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold">
          Guardar mascota
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">Listado</h2>
        {mascotas.length === 0 ? (
          <p className="text-slate-400">Aún no tienes mascotas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {mascotas.map((m) => {
              const edadMostrada =
                typeof m.edad === 'number' && m.edad > 0
                  ? Math.round(m.edad)
                  : 0;

              return (
                <li
                  key={m.id}
                  onClick={() => navigate(`/mascotas/${m.id}`)}
                  className="cursor-pointer bg-slate-800/70 rounded px-3 py-2 border border-slate-700 hover:bg-slate-700"
                >
                  <span className="font-semibold">{m.nombre}</span> —{' '}
                  {m.especie}
                  {m.raza && ` (${m.raza})`} · {edadMostrada} años
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

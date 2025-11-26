import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const MascotaDetallePage = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [mascota, setMascota] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);
  const [consultas, setConsultas] = useState<any[]>([]);

  const API_MASCOTA = `http://localhost:4000/api/mascotas/${id}`;
  const API_CITAS = `http://localhost:4000/api/citas/mascota/${id}`;
  const API_CONSULTAS = `http://localhost:4000/api/consultas/mascota/${id}`;

  useEffect(() => {
    const cargar = async () => {
      const headers = { Authorization: `Bearer ${token}` };

      // cargar mascota
      const resMasc = await fetch(API_MASCOTA, { headers });
      setMascota(await resMasc.json());

      // cargar citas
      const resCitas = await fetch(API_CITAS, { headers });
      setCitas(await resCitas.json());

      // cargar consultas
      const resCons = await fetch(API_CONSULTAS, { headers });
      setConsultas(await resCons.json());
    };

    cargar();
  }, [id]);

  if (!mascota) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6 text-slate-100">
      <h1 className="text-2xl font-bold mb-4">
        {mascota.nombre} — {mascota.especie}
      </h1>

      {mascota.raza && <p>Raza: {mascota.raza}</p>}
      {mascota.edad !== null && <p>Edad: {mascota.edad} años</p>}

      <hr className="my-4 border-slate-700" />

      <h2 className="text-xl font-semibold mb-2">Historial de citas</h2>
      {citas.length === 0 ? (
        <p className="text-slate-400">No tiene citas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {citas.map((c) => (
            <li
              key={c.id}
              className="bg-slate-800 p-3 rounded border border-slate-700"
            >
              <p>{new Date(c.fecha).toLocaleString()}</p>
              <p className="text-sm">{c.motivo}</p>
              <p className="text-sm text-emerald-300">Estado: {c.estado}</p>
            </li>
          ))}
        </ul>
      )}

      <hr className="my-4 border-slate-700" />

      <h2 className="text-xl font-semibold mb-2">Consultas médicas</h2>
      {consultas.length === 0 ? (
        <p className="text-slate-400">No tiene consultas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {consultas.map((c) => (
            <li
              key={c.id}
              className="bg-slate-800 p-3 rounded border border-slate-700"
            >
              <p>{new Date(c.fecha).toLocaleString()}</p>
              <p><strong>Diagnóstico:</strong> {c.diagnostico}</p>
              <p><strong>Tratamiento:</strong> {c.tratamiento}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

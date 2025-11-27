import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import mascotaRoutes from './routes/mascota.router';
import citaRoutes from './routes/cita.router';
import listaEsperaRoutes from './routes/listaEspera.router';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/lista-espera', listaEsperaRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Servidor veterinaria-full funcionando correctamente 🔥'
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

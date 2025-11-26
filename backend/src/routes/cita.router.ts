// backend/src/routes/cita.router.ts
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

// GET /api/citas -> listar citas del usuario logueado (cliente)
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user.id;

    const citas = await prisma.cita.findMany({
      where: { clienteId: userId },
      orderBy: { fecha: 'desc' },
      include: {
        mascota: true,
      },
    });

    res.json(citas);
  } catch (error) {
    console.error('ERROR GET /api/citas', error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
});

// GET /api/citas/mascota/:id -> listar citas de UNA mascota del usuario
router.get('/mascota/:id', async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const citas = await prisma.cita.findMany({
      where: { mascotaId: id, clienteId: userId },
      orderBy: { fecha: 'desc' },
      include: {
        mascota: true,
      },
    });

    res.json(citas);
  } catch (error) {
    console.error('ERROR GET /api/citas/mascota/:id', error);
    res.status(500).json({ message: 'Error al obtener citas de la mascota' });
  }
});

// POST /api/citas -> crear cita nueva
router.post('/', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { mascotaId, fecha, motivo } = req.body;

    const mascota = await prisma.mascota.findFirst({
      where: {
        id: Number(mascotaId),
        clienteId: userId,
      },
    });

    if (!mascota) {
      return res
        .status(400)
        .json({ message: 'Mascota no válida para este usuario' });
    }

    const cita = await prisma.cita.create({
      data: {
        fecha: new Date(fecha),
        motivo,
        clienteId: userId,
        mascotaId: mascota.id,
      },
      include: {
        mascota: true,
      },
    });

    res.status(201).json(cita);
  } catch (error) {
    console.error('ERROR POST /api/citas', error);
    res.status(500).json({ message: 'Error al crear cita' });
  }
});

// PATCH /api/citas/:id -> editar fecha / motivo
router.patch('/:id', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { fecha, motivo } = req.body;

    const cita = await prisma.cita.findFirst({
      where: { id, clienteId: userId },
    });

    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    const citaActualizada = await prisma.cita.update({
      where: { id },
      data: {
        fecha: fecha ? new Date(fecha) : cita.fecha,
        motivo: typeof motivo === 'string' ? motivo : cita.motivo,
      },
      include: {
        mascota: true,
      },
    });

    res.json(citaActualizada);
  } catch (error) {
    console.error('ERROR PATCH /api/citas/:id', error);
    res.status(500).json({ message: 'Error al actualizar cita' });
  }
});

// PATCH /api/citas/:id/cancelar -> marcar como CANCELADA
router.patch('/:id/cancelar', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const cita = await prisma.cita.findFirst({
      where: { id, clienteId: userId },
    });

    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    const citaActualizada = await prisma.cita.update({
      where: { id },
      data: { estado: 'CANCELADA' },
      include: {
        mascota: true,
      },
    });

    res.json(citaActualizada);
  } catch (error) {
    console.error('ERROR PATCH /api/citas/:id/cancelar', error);
    res.status(500).json({ message: 'Error al cancelar cita' });
  }
});

// PATCH /api/citas/:id/completar -> marcar como COMPLETADA
router.patch('/:id/completar', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const cita = await prisma.cita.findFirst({
      where: { id, clienteId: userId },
    });

    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    const citaActualizada = await prisma.cita.update({
      where: { id },
      data: { estado: 'COMPLETADA' },
      include: {
        mascota: true,
      },
    });

    res.json(citaActualizada);
  } catch (error) {
    console.error('ERROR PATCH /api/citas/:id/completar', error);
    res.status(500).json({ message: 'Error al completar cita' });
  }
});

export default router;

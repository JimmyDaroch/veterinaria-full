// backend/src/routes/listaEspera.router.ts
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas requieren estar logueado
router.use(authMiddleware);

// GET /api/lista-espera -> ver lista de espera del usuario logueado
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user.id;

    const items = await prisma.listaEspera.findMany({
      where: { clienteId: userId },
      orderBy: { fecha: 'desc' },
      include: {
        mascota: true,
      },
    });

    res.json(items);
  } catch (error) {
    console.error('ERROR GET /api/lista-espera', error);
    res.status(500).json({ message: 'Error al obtener la lista de espera' });
  }
});

// POST /api/lista-espera -> agregar mascota a la lista de espera
router.post('/', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { mascotaId, motivo, fechaDeseada } = req.body;

    if (!mascotaId) {
      return res.status(400).json({ message: 'Mascota requerida' });
    }

    // Validar que la mascota sea del usuario
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

    const item = await prisma.listaEspera.create({
      data: {
        clienteId: userId,
        mascotaId: mascota.id,
        motivo,
        // usamos fechaDeseada si viene, sino default(now())
        fecha: fechaDeseada ? new Date(fechaDeseada) : undefined,
      },
      include: {
        mascota: true,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('ERROR POST /api/lista-espera', error);
    res.status(500).json({ message: 'Error al agregar a la lista de espera' });
  }
});

// DELETE /api/lista-espera/:id -> quitar un elemento de la lista de espera
router.delete('/:id', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const existe = await prisma.listaEspera.findFirst({
      where: { id, clienteId: userId },
    });

    if (!existe) {
      return res.status(404).json({ message: 'Elemento no encontrado' });
    }

    await prisma.listaEspera.delete({ where: { id } });

    res.json({ message: 'Eliminado de la lista de espera' });
  } catch (error) {
    console.error('ERROR DELETE /api/lista-espera/:id', error);
    res.status(500).json({ message: 'Error al eliminar de la lista de espera' });
  }
});

export default router;

import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas de mascotas requieren estar logueado
router.use(authMiddleware);

// GET /api/mascotas -> listar mascotas del usuario logueado
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user.id; // viene del token

    const mascotas = await prisma.mascota.findMany({
      where: { clienteId: userId },
      orderBy: { creadoEn: 'desc' },
    });

    res.json(mascotas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener mascotas' });
  }
});

// POST /api/mascotas -> crear mascota nueva
router.post('/', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { nombre, especie, raza, edad } = req.body;

    const mascota = await prisma.mascota.create({
      data: {
        nombre,
        especie,
        raza,
        edad,
        clienteId: userId,
      },
    });

    res.status(201).json(mascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear mascota' });
  }
});

// PUT /api/mascotas/:id -> actualizar mascota
router.put('/:id', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { nombre, especie, raza, edad } = req.body;

    // Nos aseguramos de que la mascota sea del usuario
    const existe = await prisma.mascota.findFirst({
      where: { id, clienteId: userId },
    });

    if (!existe) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    const mascota = await prisma.mascota.update({
      where: { id },
      data: { nombre, especie, raza, edad },
    });

    res.json(mascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar mascota' });
  }
});

// DELETE /api/mascotas/:id -> eliminar mascota
router.delete('/:id', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const existe = await prisma.mascota.findFirst({
      where: { id, clienteId: userId },
    });

    if (!existe) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    await prisma.mascota.delete({ where: { id } });

    res.json({ message: 'Mascota eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar mascota' });
  }
});

export default router;

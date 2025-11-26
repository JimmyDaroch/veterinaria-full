import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { Rol } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Helper: generar token
function generarToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // Validar rol
    const rolesValidos = Object.values(Rol);
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // ¿Correo ya existe?
    const existente = await prisma.user.findUnique({ where: { correo } });
    if (existente) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        nombre,
        correo,
        password: hashed,
        rol,
      },
    });

    const token = generarToken({
      id: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol,
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res
        .status(400)
        .json({ message: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await prisma.user.findUnique({ where: { correo } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generarToken({
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    return res.json({
      message: 'Login correcto',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// POST /api/auth/reset-password
// body: { correo?: string, nombre?: string, nuevaPassword: string }
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { correo, nombre, nuevaPassword } = req.body;

    if (!nuevaPassword) {
      return res
        .status(400)
        .json({ message: 'La nueva contraseña es obligatoria' });
    }

    if (!correo && !nombre) {
      return res
        .status(400)
        .json({ message: 'Debes enviar correo o nombre completo' });
    }

    const usuario = await prisma.user.findFirst({
      where: {
        OR: [
          correo ? { correo } : undefined,
          nombre ? { nombre } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashed = await bcrypt.hash(nuevaPassword, 10);

    await prisma.user.update({
      where: { id: usuario.id },
      data: { password: hashed },
    });

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

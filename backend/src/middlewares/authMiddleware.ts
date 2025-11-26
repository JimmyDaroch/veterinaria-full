import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export interface JwtPayloadCustom {
  id: number;
  correo: string;
  rol: Rol;
  iat?: number;
  exp?: number;
}

// Extendemos Request localmente
export interface AuthRequest extends Request {
  user?: JwtPayloadCustom;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ message: 'No se envió token' });
  }

  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadCustom;
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const requireRoles = (...rolesPermitidos: Rol[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos' });
    }

    next();
  };
};

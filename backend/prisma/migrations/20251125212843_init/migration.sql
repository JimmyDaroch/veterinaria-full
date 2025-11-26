-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CLIENTE', 'RECEPCIONISTA', 'VETERINARIO', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "OrigenCita" AS ENUM ('NORMAL', 'LISTA_ESPERA');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'NOTIFICADO', 'COMPLETADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT,
    "fechaNac" TIMESTAMP(3),
    "peso" DOUBLE PRECISION,
    "observaciones" TEXT,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "estado" "EstadoCita" NOT NULL DEFAULT 'PENDIENTE',
    "origen" "OrigenCita" NOT NULL DEFAULT 'NORMAL',
    "clienteId" INTEGER NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "veterinarioId" INTEGER,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListaEspera" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "motivo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListaEspera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" SERIAL NOT NULL,
    "motivo" TEXT NOT NULL,
    "diagnostico" TEXT,
    "tratamiento" TEXT,
    "indicaciones" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mascotaId" INTEGER NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaProducto" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "clienteId" INTEGER,
    "nombre" TEXT,
    "correo" TEXT,
    "telefono" TEXT,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "ReservaProducto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_userId_key" ON "Cliente"("userId");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_veterinarioId_fkey" FOREIGN KEY ("veterinarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaEspera" ADD CONSTRAINT "ListaEspera_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaEspera" ADD CONSTRAINT "ListaEspera_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaProducto" ADD CONSTRAINT "ReservaProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaProducto" ADD CONSTRAINT "ReservaProducto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

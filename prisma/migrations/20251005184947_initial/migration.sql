-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "vendedor" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

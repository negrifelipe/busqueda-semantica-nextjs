"use server";

import prisma from "@/lib/prisma";
import { generateEmbedding } from "@/lib/openai";
import { revalidatePath } from "next/cache";
import type { Producto, ProductoSimple, ResultadoBusqueda } from "@/lib/types";

export async function agregarProducto(formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const vendedor = formData.get("vendedor") as string;
    const descripcion = formData.get("descripcion") as string;

    if (!nombre || !vendedor || !descripcion) {
      return {
        success: false,
        error: "Todos los campos son requeridos",
      };
    }

    // Generar el embedding combinando todos los campos
    /*
    Los modelos tienen un limite de tokens, por lo que si la descripción es muy larga, no funcionanda.
    Una cosa que se podria hacer es pedile a un modelo de lenguaje que cree un resumen y deje lo 
    mas importante de la informacion del producto 
     */
    /*
    Dependiendo de la escala y lo que uno necesita, se podria considerar 
    agregar el producto a una cola y que otro servicio sea 
    el encargado de generar el embedding y guardarlo en la base de datos
     */
    const resumen = `${nombre} ${vendedor} ${descripcion}`;
    const embedding = await generateEmbedding(resumen);

    // Convertir el array de números a formato de vector de PostgreSQL
    const vectorString = `[${embedding.join(",")}]`;

    // Crear el producto en la base de datos
    await prisma.$executeRaw`
      INSERT INTO productos (nombre, vendedor, descripcion, embedding)
      VALUES (${nombre}, ${vendedor}, ${descripcion}, ${vectorString}::vector)
    `;

    // Revalidar la página para actualizar los datos
    revalidatePath("/");

    return {
      success: true,
      message: "Producto agregado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear producto:", error);
    return {
      success: false,
      error: "Error al crear el producto",
    };
  }
}

export async function buscarProductos(query: string) {
  try {
    if (!query) {
      return {
        success: false,
        error: "La consulta de búsqueda es requerida",
      };
    }

    // Generar el embedding de la consulta
    const queryEmbedding = await generateEmbedding(query);
    const vectorString = `[${queryEmbedding.join(",")}]`;

    // Realizar búsqueda semántica usando distancia de coseno
    const resultados = await prisma.$queryRaw<ResultadoBusqueda[]>`
      SELECT 
        id, 
        nombre, 
        vendedor, 
        embedding <-> ${vectorString}::vector as distancia
      FROM productos
      WHERE embedding IS NOT NULL
      ORDER BY distancia
      LIMIT 3
    `;

    return {
      success: true,
      resultados,
      total: resultados.length,
    };
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return {
      success: false,
      error: "Error al realizar la búsqueda",
      resultados: [],
    };
  }
}

export async function obtenerTodosProductos() {
  try {
    const productos: ProductoSimple[] = await prisma.producto.findMany({
      select: { id: true, nombre: true, vendedor: true },
      orderBy: { id: "desc" },
    });

    return {
      success: true,
      productos,
      total: productos.length,
    };
  } catch (error) {
    console.error("Error al listar productos:", error);
    return {
      success: false,
      error: "Error al obtener los productos",
      productos: [],
    };
  }
}

export async function obtenerProductoPorId(id: number) {
  try {
    const producto: Producto | null = await prisma.producto.findUnique({
      where: { id },
      select: { id: true, nombre: true, vendedor: true, descripcion: true },
    });

    if (!producto) {
      return {
        success: false,
        error: "Producto no encontrado",
        producto: null,
      };
    }

    return {
      success: true,
      producto,
    };
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return {
      success: false,
      error: "Error al obtener el producto",
      producto: null,
    };
  }
}

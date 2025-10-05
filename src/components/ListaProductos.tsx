import { obtenerTodosProductos } from "@/actions/productos";
import Link from "next/link";
import type { Producto } from "@/lib/types";

export default async function ListaProductos() {
  const { productos } = await obtenerTodosProductos();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Todos los Productos
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
          {productos.length} {productos.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">�️</div>
          <p className="text-slate-500 dark:text-slate-400">
            No hay productos registrados aún.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            Agrega tu primer producto usando el formulario de arriba.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map(
            (producto: Pick<Producto, "id" | "nombre" | "vendedor">) => (
              <Link
                key={producto.id}
                href={`/producto/${producto.id}`}
                className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-all hover:scale-[1.02] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 block"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {producto.vendedor}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 flex-shrink-0">
                    #{producto.id}
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

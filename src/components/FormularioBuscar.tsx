"use client";

import { useState, useTransition } from "react";
import { buscarProductos } from "@/actions/productos";
import { ResultadoBusqueda } from "@/lib/types";

export default function FormularioBuscar() {
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setResultados([]);

    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;

    startTransition(async () => {
      const resultado = await buscarProductos(query);

      if (resultado.success) {
        setResultados(resultado.resultados || []);
        if (resultado.resultados?.length === 0) {
          setMensaje("No se encontraron resultados");
        }
      } else {
        setMensaje(`❌ Error: ${resultado.error}`);
      }
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
          Buscar Productos
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="query"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              ¿Qué estás buscando?
            </label>
            <input
              type="text"
              id="query"
              name="query"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="una laptop con buena batería..."
              required
              disabled={isPending}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            {isPending ? "Buscando..." : "🔍 Buscar"}
          </button>
        </form>

        {mensaje && (
          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            {mensaje}
          </div>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {resultados.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
            Resultados de la búsqueda
          </h2>
          <div className="space-y-4">
            {resultados.map((resultado, i) => (
              <div
                key={resultado.id}
                className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-700/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {resultado.nombre}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {resultado.vendedor}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                      Rank #{i + 1}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Similitud: {(1 - resultado.distancia).toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

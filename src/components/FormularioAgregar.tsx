"use client";

import { useState, useTransition } from "react";
import { agregarProducto } from "@/actions/productos";

export default function FormularioAgregar() {
  const [mensaje, setMensaje] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const resultado = await agregarProducto(formData);

      if (resultado.success) {
        setMensaje("✅ Producto agregado exitosamente");
      } else {
        setMensaje(`❌ Error: ${resultado.error}`);
      }

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMensaje(""), 5000);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
        Agregar Producto
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Nombre del Producto
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Laptop MacBook Pro 14"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="vendedor"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Vendedor
          </label>
          <input
            type="text"
            id="vendedor"
            name="vendedor"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="TechStore"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Descripción (Markdown)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono text-sm"
            placeholder="## Características&#10;&#10;- Procesador M3 Pro&#10;- 16GB RAM&#10;- Pantalla Retina&#10;&#10;**Precio:** $1999"
            rows={6}
            required
            disabled={isPending}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Puedes usar Markdown para dar formato a la descripción
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          {isPending ? "Agregando..." : "Agregar Producto"}
        </button>
      </form>

      {mensaje && (
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
          {mensaje}
        </div>
      )}
    </div>
  );
}

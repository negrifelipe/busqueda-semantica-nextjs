import { Suspense } from "react";
import FormularioAgregar from "@/components/FormularioAgregar";
import FormularioBuscar from "@/components/FormularioBuscar";
import ListaProductos from "@/components/ListaProductos";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
          Búsqueda Semántica de Productos
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Formulario para agregar productos */}
          <FormularioAgregar />

          {/* Formulario de búsqueda */}
          <FormularioBuscar />
        </div>

        {/* Lista de todos los productos */}
        <Suspense fallback={<SkeletonLoader />}>
          <ListaProductos />
        </Suspense>
      </div>
    </div>
  );
}

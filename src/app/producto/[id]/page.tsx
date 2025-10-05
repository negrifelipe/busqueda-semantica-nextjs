import { notFound } from "next/navigation";
import { obtenerProductoPorId } from "@/actions/productos";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const productoId = parseInt(id);

  if (isNaN(productoId)) {
    notFound();
  }

  const { success, producto } = await obtenerProductoPorId(productoId);

  if (!success || !producto) {
    notFound();
  }

  const descripcionHtml = await markdownToHtml(producto.descripcion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Botón de regreso */}
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a la tienda
        </Link>

        {/* Tarjeta del producto */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              {producto.nombre}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">
                Vendedor:
              </span>
              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {producto.vendedor}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                ID: #{producto.id}
              </span>
            </div>
          </div>

          {/* Descripción en Markdown renderizada con Typography */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none
              prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-p:text-slate-700 dark:prose-p:text-slate-300
              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-code:text-slate-900 dark:prose-code:text-white
              prose-code:bg-slate-100 dark:prose-code:bg-slate-700
              prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-100 dark:prose-pre:bg-slate-700
              prose-ul:text-slate-700 dark:prose-ul:text-slate-300
              prose-ol:text-slate-700 dark:prose-ol:text-slate-300
              prose-li:text-slate-700 dark:prose-li:text-slate-300
              prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
              prose-blockquote:border-l-slate-300 dark:prose-blockquote:border-l-slate-600"
            dangerouslySetInnerHTML={{ __html: descripcionHtml }}
          />
        </div>
      </div>
    </div>
  );
}

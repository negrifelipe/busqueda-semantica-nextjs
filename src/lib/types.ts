export interface Producto {
  id: number;
  nombre: string;
  vendedor: string;
  descripcion: string;
}

export interface ProductoSimple {
  id: number;
  nombre: string;
  vendedor: string;
}

export interface ResultadoBusqueda {
  id: number;
  nombre: string;
  vendedor: string;
  distancia: number;
}

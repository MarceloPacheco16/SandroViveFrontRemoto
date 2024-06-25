export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    talle: string;
    color: string;
    categoria: number;
    subcategoria: number;
    precio: number;
    cantidad: number;
    cantidad_disponible: number;
    cantidad_limite: number;
    imagen: string;
    observaciones: string;
    activo: number;
  }